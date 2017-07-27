import React from 'react'
import { withRouter } from 'react-router'
import { compose, graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { connect } from 'react-redux'

import { Animated, Dimensions, Image, Text, View, TouchableHighlight } from 'react-native'
import { FBLoginManager } from 'react-native-facebook-login'

import Separator from './Separator'

import styles from '../styles/styles'
import appStyle from '../styles/appStyle'

import currentUserQuery from '../../client/shared/graphql/queries/currentUser'
import sessionCountQuery from '../../client/shared/graphql/queries/sessionCount'

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
    fadeAnim: new Animated.Value(0)
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
    this.props.logout()
      .then(() => {
        FBLoginManager.getCredentials((error, data) => {
          if (!error && data && data.credentials) {
            FBLoginManager.logout(() => {}) // any callback is required
          }
        })
        this.props.client.resetStore()
      })
  }

  go = (path) => () => {
    console.log('######EEEEEEXTRAAA PONTON######: this.props', this.props)
    this.props.history.push(path)
  }

  render () {
    if (this.props.currentUser.loading || this.props.sessionCount.loading) {
      return <View />
    }
    let { fadeAnim } = this.state

    const currentUser = this.props.currentUser.CurrentUser
    const activated = currentUser && currentUser.activated
    const sessionCount = this.props.sessionCount.SessionCount

    const height = Dimensions.get('window').height - this.props.topMargin

    return (
      <Animated.View style={[styles.headerWithShadow, styles.menuOverlay, { backgroundColor: '#eee', opacity: fadeAnim, top: this.props.topMargin, justifyContent: 'space-between',  height }]}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          flexDirection: 'row',
          width: '100%',
          height: '33%',
          backgroundColor: 'white',
        }}>
          <Image
            style={{ width: '25%', height: '85%', marginLeft: 20, resizeMode: 'contain' }}
            source={require('../images/BillyBaby.png')}
          />
          {currentUser &&
            <View style={{
              width: '70%',
              padding: 20
            }}>
              <Text style={[styles.textDefault, { fontSize: 26, color: '#6905ea' }]}>
                Michał
              </Text>
              <View style={{ width: '100%', marginTop: 5, flexDirection: 'row' }}>
                <View style={{ width: '50%', padding: 10, alignItems: 'center' }}>
                  <Text style={style.text}>DUE</Text>
                  <Text style={style.textBold}>{sessionCount.dueDone}/{sessionCount.dueTotal}</Text>
                  <View style={[style.card, { backgroundColor: '#4ba695' }]} />
                </View>
                <View style={{ position: 'relative', width: 1, backgroundColor: '#999', zIndex: 1000 }}>
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
        <View style={{marginBottom: '10%', marginTop: '3%', flex: 1, justifyContent: 'flex-start'}}>
          {activated
            ? <MenuButton text="LOG OUT" onPress={this.logout} />
            : <MenuButton text="LOG IN" onPress={this.go('/login')} />
          }
          {currentUser &&
            <View>
              <Separator />
              {this.props.selectedCourse ? <MenuButton text="LECTURES LIST" onPress={this.go('/lectures')} /> : null }
              {this.props.selectedCourse ? <Separator /> : null }

              <MenuButton text="REVIEWS CALENDAR" onPress={this.go('/calendar')} />
              <Separator />
              {this.props.selectedCourse ? <MenuButton text="CHANGE THE COURSE" onPress={this.props.closeCourse ? this.props.closeCourse : this.go('/')} /> : null }
              {this.props.selectedCourse ? <Separator /> : null }
              <MenuButton text="ACHIEVEMENTS LIST" onPress={this.go('/achievements')} />
              <Separator />
              <MenuButton text="PROFILE" onPress={this.go('/profile')} />
            </View>
          }
          <Separator />
          <MenuButton text="CONTACT" onPress={this.go('/contact')} />
          {/*<Separator />*/}
          {/*<MenuButton text="QUESTIONS" onPress={this.go('/questions')} />*/}
          {/*<Separator />*/}
          {/*<MenuButton text="CONGRATULATIONS" onPress={this.go('/congratulations')} />*/}
          {/*<Separator />*/}
          {/*<MenuButton text="SIGN UP" onPress={this.go('/signup')} />*/}
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
    fontFamily: 'Exo2-Bold',
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

const logOutQuery = gql`
    mutation logOut {
        logOut {
            _id, username, activated
        }
    }
`

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  withApollo,
  withRouter,
  connect(mapStateToProps),
  graphql(logOutQuery, {
    props: ({ ownProps, mutate }) => ({
      logout: () => mutate({
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult', mutationResult)
            console.log('Gozdecki: prev', prev)
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logOut
              }
            })
          }
        }
      })
    })
  }),
  graphql(sessionCountQuery, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(MainMenu)
