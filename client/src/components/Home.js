// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import currentItemsExistQuery from '../../shared/graphql/queries/currentItemsExist'

class Home extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (!nextProps.data || nextProps.data.loading || nextProps.data.error) {
      return
    }

    if (nextProps.data.ItemsWithFlashcard.length > 0) {
      nextProps.dispatch(push('/questions'))
    } else {
      nextProps.dispatch(push('/lecture'))
    }
  }

  render () {
    if (this.props.data.loading) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }

    return <div></div>
  }
}

export default compose(
  connect(),
  withRouter,
  graphql(currentItemsExistQuery)
)(Home)
