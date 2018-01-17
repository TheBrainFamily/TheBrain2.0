// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import currentItemsExistQuery from 'thebrain-shared/graphql/queries/currentItemsExist'

class Course extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (!nextProps.data || nextProps.data.loading || nextProps.data.error) {
      return
    }

    const courseId = nextProps.match.params.courseId

    if (nextProps.data.Items.length > 0) {
      nextProps.dispatch(push('/questions'))
    } else {
      nextProps.dispatch(push(`/lecture/${courseId}`))
    }
  }

  render () {
    if (this.props.data.loading) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }

    return <div />
  }
}

export default compose(
  connect(),
  withRouter,
  graphql(currentItemsExistQuery, {
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(Course)
