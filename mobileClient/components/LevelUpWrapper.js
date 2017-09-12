import React from 'react'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import userDetailsQuery from '../shared/graphql/queries/userDetails'

export default (Component) => {

  class LevelUpWrapper extends React.Component {
    componentWillReceiveProps = (nextProps) => {
      if (nextProps.userDetails && nextProps.userDetails.UserDetails && nextProps.userDetails.UserDetails.experience) {
        if (nextProps.userDetails.UserDetails.experience.showLevelUp) {
          nextProps.history.push('/congratulations')
        }
      }
    }

    render () {
      return (
        <Component {...this.props}/>
      )
    }
  }

  return compose(
    withRouter,
    graphql(userDetailsQuery, {
      name: 'userDetails'
    })
  )(LevelUpWrapper)
}
