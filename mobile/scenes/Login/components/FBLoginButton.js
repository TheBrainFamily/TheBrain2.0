import React from 'react'
import Expo from 'expo'
import { withRouter } from 'react-router'
import { withApollo, graphql, compose } from 'react-apollo'
import { AsyncStorage, Alert, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux'
import { getGraphqlForLogInWithFacebookAccessToken } from 'thebrain-shared/graphql/account/logInWithFacebookAccessToken'
import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'
import * as courseActions from '../../../actions/CourseActions'
import fbButtonImg from './images/loginwfb.png'

const FB_APP_ID = '1621044308126388'

class FBLoginButton extends React.Component {
  logInWithFacebookAccessToken = async (accessTokenFb) => {
    this.props.setLoadingState(true)
    this.props.dispatch(courseActions.close())
    this.props.logInWithFacebookAccessToken({ accessTokenFb }).then(async () => {
      await AsyncStorage.setItem('accessTokenFb', accessTokenFb)
      await this.props.userDetails.refetch()
      this.props.history.push('/')
      this.props.setLoadingState(false)
    }).catch(() => {
      this.props.setLoadingState(false)
      Alert.alert('Log in failed', 'Please try again later')
    })
  }

  _handlePressAsync = async () => {
    const response = await Expo.Facebook.logInWithReadPermissionsAsync(FB_APP_ID, {
      permissions: ['public_profile']
    })

    if (response.token) {
      this.logInWithFacebookAccessToken(response.token)
    }
  }

  render () {
    return (<View style={{ maxHeight: 40, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={this._handlePressAsync}>
        <Image resizeMode={'contain'}
          source={fbButtonImg}
          style={{ width: 200, alignSelf: 'center' }} />
      </TouchableOpacity>
    </View>)
  };
}

export default withRouter(withApollo(compose(
  connect(),
  getGraphqlForLogInWithFacebookAccessToken(graphql),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(FBLoginButton)))
