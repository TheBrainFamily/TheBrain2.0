import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import Header from './Header'
import PageTitle from './PageTitle'

import changePasswordMutation from '../../client/shared/graphql/queries/changePasswordMutation'
class Profile extends React.Component {
  render () {
    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />

        <PageTitle text='PROFILE' />
      </View>
    )
  }
}

export default compose(
  connect(),
  graphql(changePasswordMutation, {
    props: ({ mutate }) => ({
      submit: ({ oldPassword, newPassword }) => mutate({
        variables: {
          oldPassword,
          newPassword
        }
      })
    })
  }),
)(Profile)
