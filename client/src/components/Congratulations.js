// @flow

import React from 'react'
import FlexibleContentWrapper from './FlexibleContentWrapper'


import _ from 'lodash'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import currentUserQuery from '../../shared/graphql/queries/currentUser'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'
import levelConfig from '../../shared/helpers/levelConfig'

class Congratulations extends React.Component {
  click = () => {
    this.props.history.push('/')
  }

  render () {
    const username = _.get(this.props, 'currentUser.CurrentUser.username', 'Guest')
    const userLevel = _.get(this.props, 'userDetails.UserDetails.experience.level', 1)
    const levelCap = levelConfig.levelCap
    const level = Math.min(userLevel, levelCap)

    return (
      <FlexibleContentWrapper>

        Congratulations


        {username} <br/>

        <img className={'levelUpImage'}
             src={levelConfig[level].file}
        />

        You've just became<br/>

        {levelConfig[level].name} (level {userLevel})<br/>


        <div onClick={this.click}>

          Continue learning!

        </div>
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
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
)(Congratulations)
