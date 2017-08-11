// @flow

import React from 'react'
import FlexibleContentWrapper from './FlexibleContentWrapper'

import _ from 'lodash'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import levelConfig from '../../shared/helpers/levelConfig'
import currentUserQuery from '../../shared/graphql/queries/currentUser'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'
import confirmLevelUpMutation from '../../shared/graphql/mutations/confirmLevelUp'

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
      <FlexibleContentWrapper>

        <h2>Congratulations {username}!</h2>

        <img className={'levelUpImage'}
             src={levelConfig[level].file}
             alt={levelConfig[level].name}
        />

        <h2>You've just became<br/>

          {levelConfig[level].name} (level {userLevel})</h2>
        <div className={'confirm-level-up-button'} onClick={this.click}>Continue learning!</div>
      </FlexibleContentWrapper>
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
