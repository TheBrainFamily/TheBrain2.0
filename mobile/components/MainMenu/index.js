import _ from 'lodash'
import React from 'react'
import { compose, graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Animated, Dimensions, Keyboard, View } from 'react-native'
import Loading from '../Loading'
import levelConfig from 'thebrain-shared/helpers/levelConfig'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'
import sessionCountQuery from 'thebrain-shared/graphql/items/sessionCount'
import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'

import WithData from '../WithData'
import MainMenuHeader from './components/MainMenuHeader'
import MainMenuOptions from './components/MainMenuOptions'

import appStyle from '../../styles/appStyle'
import globalStyles from '../../styles/styles'
import localStyles from './styles'
const styles = {...globalStyles, ...localStyles}

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

  get isStillLoading () {
    return this.props.loading || this.props.currentUser.loading || this.props.sessionCount.loading || this.props.userDetails.loading
  }

  renderLoadingView (height) {
    return <View style={[styles.headerWithShadow, styles.menuOverlay, {
      backgroundColor: '#fff',
      top: this.props.topMargin,
      justifyContent: 'space-between',
      height
    }]}>
      <Loading lightStyle />
    </View>
  }

  renderContentView (height) {
    const currentUser = this.props.currentUser.CurrentUser
    const activated = currentUser && currentUser.activated
    const sessionCount = this.props.sessionCount.SessionCount
    const username = _.get(this.props, 'currentUser.CurrentUser.username', 'Guest')
    const userLevel = _.get(this.props, 'userDetails.UserDetails.experience.level', 1)
    const levelCap = levelConfig.levelCap
    const level = Math.min(userLevel, levelCap)

    return <View style={[{height}]}>
      <MainMenuHeader level={level} currentUser={currentUser} username={username} sessionCount={sessionCount} />
      <MainMenuOptions activated={activated} currentUser={currentUser} changeSafeAreaViewBackground={this.props.changeSafeAreaViewBackground} />
    </View>
  }

  render () {
    const height = Dimensions.get('window').height - this.props.topMargin
    let { fadeAnim } = this.state
    Keyboard.dismiss()

    return (
      <Animated.View style={[styles.headerWithShadow, styles.menuOverlay, {
        backgroundColor: '#eee',
        opacity: fadeAnim,
        top: this.props.topMargin,
        justifyContent: 'space-between',
        height
      }]}>
        { this.isStillLoading ? this.renderLoadingView(height) : this.renderContentView(height) }
      </Animated.View>
    )
  }
}

MainMenu.defaultProps = {
  topMargin: appStyle.header.height
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse,
    loading: state.mainMenu.loading
  }
}

export default compose(
  withApollo,
  withRouter,
  connect(mapStateToProps),
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
