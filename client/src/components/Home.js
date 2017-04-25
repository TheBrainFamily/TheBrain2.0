import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

class Home extends React.Component {
  render () {
    const {dispatch} = this.props

    if (this.props.data.loading) {
      return (<p>Loading...</p>)
    }

    if (this.props.data.error) {
      return (<p>Error...</p>)
    }
    if (this.props.data.ItemsWithFlashcard.length > 0) {
      dispatch(push('/questions'))
    } else {
      dispatch(push('/lecture'))
    }
    return <div></div>
  }
}

const query = gql`
    query CurrentItemsExist {
        ItemsWithFlashcard {
            item {
                _id
            }
        }
    }
`
export default connect()(withRouter(graphql(query)(Home)))
