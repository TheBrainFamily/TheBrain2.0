import _ from 'lodash'
import React from 'react'
import { withRouter } from 'react-router'
import { compose, graphql, withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { Animated, Dimensions, Image, Keyboard, Text, TouchableHighlight, View, AsyncStorage } from 'react-native'

import * as courseActions from '../actions/CourseActions'
import * as mainMenuActions from '../actions/MainMenuActions'

import Separator from './Separator'
import Loading from './Loading'

import styles from '../styles/styles'
import appStyle from '../styles/appStyle'
import levelConfig from 'thebrain-shared/helpers/levelConfig'

import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import sessionCountQuery from 'thebrain-shared/graphql/queries/sessionCount'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import { getGraphqlForCloseCourseMutation } from 'thebrain-shared/graphql/mutations/closeCourse'
import { getGraphqlForLogout } from 'thebrain-shared/graphql/mutations/logout'
import WithData from './WithData'

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

class MainMenu extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),
    loading: false
  }

  componentDidMount () {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 200
      }
    ).start()
  }

  logout = () => {
    console.log('>>>>>>>>>> LOGOUT')
    // TODO this is a weird pattern, double check it
    this.setState({ loading: true }, async () => {
      await AsyncStorage.removeItem('accessTokenFb')
      await AsyncStorage.removeItem('accessToken')
      await AsyncStorage.removeItem('userId')
      await AsyncStorage.removeItem('userIdFb')
      this.props.logout()
        .then(async () => {
          await this.props.userDetails.refetch()
          this.props.dispatch(courseActions.close())
          this.props.client.resetStore()
          this.closeMenu()
          this.props.logoutAction && this.props.logoutAction()
          this.setState({loading: false})
          this.props.history.push('/')
        })
        .catch(() => {
          this.closeMenu()
          this.setState({loading: false})
          this.history.push('/nointernet')
        })
    })
  }

  closeMenu = () => {
    this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
      visible: false
    }))
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
    const height = Dimensions.get('window').height - this.props.topMargin

    if (this.state.loading || this.props.currentUser.loading || this.props.sessionCount.loading || this.props.userDetails.loading) {
      return <View style={[styles.headerWithShadow, styles.menuOverlay, {
        backgroundColor: '#fff',
        top: this.props.topMargin,
        justifyContent: 'space-between',
        height
      }]}>
        <Loading lightStyle />
      </View>
    }
    let { fadeAnim } = this.state

    const currentUser = this.props.currentUser.CurrentUser
    const activated = currentUser && currentUser.activated
    const sessionCount = this.props.sessionCount.SessionCount
    const username = _.get(this.props, 'currentUser.CurrentUser.username', 'Guest')
    const userLevel = _.get(this.props, 'userDetails.UserDetails.experience.level', 1)
    const levelCap = levelConfig.levelCap
    // TODO extract this to a separate component
    const level = Math.min(userLevel, levelCap)

    // TODO in general split this up into different components

    Keyboard.dismiss()

    return (
      <Animated.View style={[styles.headerWithShadow, styles.menuOverlay, {
        backgroundColor: '#eee',
        opacity: fadeAnim,
        top: this.props.topMargin,
        justifyContent: 'space-between',
        height
      }]}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          flexDirection: 'row',
          width: '100%',
          height: '33%',
          backgroundColor: 'white'
        }}>
          <Image
            style={{ width: '25%', height: '85%', marginLeft: 20, resizeMode: 'contain' }}
            source={levelConfig[level].file}
          />
          {currentUser &&
          <View style={{
            width: '70%',
            padding: 20
          }}>
            <Text style={[styles.textDefault, { fontSize: 26, color: '#6905ea' }]}>
              {username}
            </Text>
            <View style={{ width: '100%', marginTop: 5, flexDirection: 'row' }}>
              <View style={{ width: '50%', padding: 10, alignItems: 'center' }}>
                <Text style={style.text}>DUE</Text>
                <Text style={style.textBold}>{sessionCount.dueDone}/{sessionCount.dueTotal}</Text>
                <View style={[style.card, { backgroundColor: '#4ba695' }]} />
              </View>
              <View style={{ position: 'relative', width: 1, backgroundColor: '#999', elevation: 1000 }}>
                <View style={{
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: '#999'
                }} />
                <View style={{
                  position: 'absolute',
                  bottom: -4,
                  left: -4,
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: '#999'
                }} />
              </View>
              <View style={{ width: '50%', padding: 10, alignItems: 'center' }}>
                <Text style={style.text}>REVIEW</Text>
                <Text style={style.textBold}>{sessionCount.reviewDone}/{sessionCount.reviewTotal}</Text>
                <View style={[style.card, { backgroundColor: '#c64f34' }]} />
              </View>
            </View>
          </View>
          }
        </View>
        <View style={{ marginBottom: '10%', marginTop: '3%', flex: 1, justifyContent: 'flex-start' }}>
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
        </View>
      </Animated.View>
    )
  }
}

const style = {
  text: {
    color: '#999',
    fontFamily: 'Exo2-Regular'
  },
  textBold: {
    color: '#999',

    fontSize: 18
  },
  card: {
    width: 20,
    height: 14,
    marginTop: 8
  }
}

MainMenu.defaultProps = {
  topMargin: appStyle.header.height
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  withApollo,
  withRouter,
  connect(mapStateToProps),
  connect(state => state),
  getGraphqlForCloseCourseMutation(graphql),
  getGraphqlForLogout(graphql),
  graphql(sessionCountQuery, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(currentUserQuery, {
    name: 'currentUser'
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails'
  })
)(WithData(MainMenu, ['currentUser', 'userDetails', 'sessionCount']))
