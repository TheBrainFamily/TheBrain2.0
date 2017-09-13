// @flow
import _ from 'lodash'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import levelConfig from '../shared/helpers/levelConfig'
import currentUserQuery from '../shared/graphql/queries/currentUser'
import userDetailsQuery from '../shared/graphql/queries/userDetails'
import confirmLevelUpMutation from '../shared/graphql/mutations/confirmLevelUp'
import PageContainer from './PageContainer'

import styles from '../styles/styles'

class Congratulations extends React.Component {
  click = () => {
    this.props.confirmLevelUp()
  }

  componentWillReceiveProps = (nextProps) => {
    if(!nextProps.userDetails.UserDetails.experience.showLevelUp) {
      this.props.history.push('/')
    }
  }

  render () {
    const username = _.get(this.props, 'currentUser.CurrentUser.username', 'Guest')
    const userLevel = _.get(this.props, 'userDetails.UserDetails.experience.level', 1)
    const levelCap = levelConfig.levelCap
    const level = Math.min(userLevel, levelCap)
    return (
      <PageContainer>
        <View style={{ backgroundColor: '#6905ea', height: '100%', paddingTop: 10 }}>
          <Text style={[styles.textDefault, { fontSize: 26 }]}>
            Congratulations
          </Text>
          <Text style={[styles.textDefault, { fontSize: 26, lineHeight: 36 }]}>
            {username}
          </Text>
          <View style={{ width: '100%', height: '35%', marginVertical: 10 }}>
            <Image
              style={{ width: '25%', height: '100%', alignSelf: 'center' }}
              source={levelConfig[level].file}
            />
          </View>
          <Text style={[styles.textDefault, { fontSize: 12 }]}>
            You've just became
          </Text>
          <Text style={[styles.textDefault, { fontSize: 26 }]}>
            {levelConfig[level].name} (level {userLevel})
          </Text>


          <TouchableOpacity onPress={this.click}>
            <Text style={[styles.button, { backgroundColor: '#68b888', marginTop: 10, marginHorizontal: 10, paddingHorizontal: 50 }]}>
              Continue learning!
            </Text>
          </TouchableOpacity>
        </View>
      </PageContainer>
    )
  }
}

export default compose(
  connect(),
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(confirmLevelUpMutation, {
    props: ({ ownProps, mutate }) => ({
      confirmLevelUp: () => mutate({
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
)(Congratulations)
