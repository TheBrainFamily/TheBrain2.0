import React from 'react'
import { AsyncStorage, Text, TouchableHighlight, View } from 'react-native'
import Separator from '../../../components/Separator'
import styles from '../../../styles/styles'
import * as courseActions from '../../../actions/CourseActions'
import { withRouter } from 'react-router'
import { compose, graphql, withApollo } from 'react-apollo'
import { getGraphqlForLogout } from 'thebrain-shared/graphql/account/logout'
import { getGraphqlForCloseCourseMutation } from 'thebrain-shared/graphql/courses/closeCourse'
import { connect } from 'react-redux'
import * as mainMenuActions from '../../../actions/MainMenuActions'

const MenuButton = (props) => (
  <TouchableHighlight
    onPress={props.onPress}
    activeOpacity={1}
    underlayColor='#fff'
    style={styles.menuButton}
  >
    <Text style={styles.menuButtonText}>{props.text}</Text>
  </TouchableHighlight>
)

class MainMenuOptions extends React.Component {
  closeMenu = () => {
    this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
      visible: false
    }))
  }

  logout = async() => {
    console.log('>>>>>>>>>> LOGOUT')
    // TODO this is a weird pattern, double check it
    await this.props.dispatch(mainMenuActions.updateMainMenuLoadingState(true))

    await AsyncStorage.removeItem('accessTokenFb')
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('userId')
    await AsyncStorage.removeItem('userIdFb')
    this.props.logout()
        .then(async () => {
          this.props.dispatch(courseActions.close())
          this.props.client.resetStore()
          this.closeMenu()
          this.props.logoutAction && this.props.logoutAction()
          await this.props.dispatch(mainMenuActions.updateMainMenuLoadingState(false))
          this.props.history.push('/')
        })
        .catch(() => {
          this.closeMenu()
          this.props.dispatch(mainMenuActions.updateMainMenuLoadingState(false))
          this.history.push('/nointernet')
        })
  }

  go = (path) => () => {
    this.props.history.push(path)
    this.closeMenu()
  }

  closeCourse = async () => {
    this.closeMenu()
    this.props.dispatch(courseActions.close())
    await this.props.closeCourseMutation()
    this.go('/')()
  }

  render () {
    const {activated, currentUser} = this.props
    return (<View style={{marginBottom: '10%', marginTop: '3%', flex: 1, justifyContent: 'flex-start'}}>
      {activated
        ? <MenuButton text='LOG OUT' onPress={this.logout} />
        : <MenuButton text='LOG IN' onPress={this.go('/login')} />
      }
      <Separator />
      {currentUser &&
      <View>
        {this.props.selectedCourse ? <MenuButton text='LECTURES LIST' onPress={this.go('/lectures')} /> : null}
        {this.props.selectedCourse ? <Separator /> : null}

        <MenuButton text='REVIEWS CALENDAR' onPress={this.go('/calendar')} />
        <Separator />
        {this.props.selectedCourse ? <MenuButton text='CHANGE THE COURSE'
          onPress={() => {
            this.props.closeCourse ? this.props.closeCourse() : this.closeCourse()
          }} /> : null}
        {this.props.selectedCourse ? <Separator /> : null}
        <MenuButton text='PROFILE' onPress={this.go('/profile')} />
        <Separator />
      </View>
      }
      <MenuButton text='CONTACT' onPress={this.go('/contact')} />
    </View>)
  }
}

export default compose(
  withApollo,
  withRouter,
  connect(state => state),
  getGraphqlForLogout(graphql),
  getGraphqlForCloseCourseMutation(graphql)
)(MainMenuOptions)
