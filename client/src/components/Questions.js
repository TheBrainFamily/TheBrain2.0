// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Flashcard from './Flashcard'
import currentUserQuery from '../../shared/graphql/queries/currentUser'
import sessionCountQuery from '../../shared/graphql/queries/sessionCount'

class Questions extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentItems.loading || nextProps.currentUser.loading || nextProps.sessionCount.loading) {
      return
    }

    const itemsWithFlashcard = nextProps.currentItems.ItemsWithFlashcard

    if (itemsWithFlashcard.length > 0) {
      return
    }

    if (nextProps.currentUser.activated) {
      nextProps.dispatch(push('/'))
    } else {
      nextProps.dispatch(push('/signup'))
    }
  }

  componentWillMount = () => {
    this.updateDimensions()
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.updateDimensions)
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions = () => {
    console.log({
      width: window.innerWidth,
      height: window.innerHeight
    })
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  calcComponentWidth = (height) => {
    return height - 350;
  }

  render () {
    if (this.props.currentItems.loading || this.props.currentUser.loading || this.props.sessionCount.loading) {
      return <div>Loading...</div>
    } else {
      const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard

      if (!itemsWithFlashcard.length > 0) {
        return <div />
      }

      const flashcard = itemsWithFlashcard[0].flashcard
      const evalItem = itemsWithFlashcard[0].item

      return (
        <Flashcard question={flashcard.question} answer={flashcard.answer} evalItemId={evalItem._id} />
      )
    }
  }
}

const currentItemsQuery = gql`
    query CurrentItems {
        ItemsWithFlashcard {
            item {
                _id
                flashcardId
                extraRepeatToday
                actualTimesRepeated
            }
            flashcard
            {
                _id question answer
            }
        }
    }
`

export default compose(
  connect(),
  withRouter,
  graphql(currentUserQuery, { name: 'currentUser' }),
  graphql(currentItemsQuery, {
    name: 'currentItems',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(sessionCountQuery, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(Questions)
