// @flow

import React from 'react'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { withRouter } from 'react-router'

import { flashcard } from '../actions'

import sessionCountQuery from '../../shared/graphql/queries/sessionCount'

class Flashcard extends React.Component {
  answeredQuestion = () => {
    this.props.dispatch(flashcard.showAnswer(true))
  }

  onSubmitEvaluation = (value) => {
    this.props.submit({
      itemId: this.props.evalItemId,
      evaluation: value
    })
    this.props.dispatch(flashcard.showAnswer(false))
  }

  render () {
    if (!this.props.isAnswerVisible) {
      return (
        <div>
          <div className='flashcard' style={{cursor: 'pointer'}} onClick={this.answeredQuestion}>
            <div className="flashcard-title">Question: title</div>
            <div className="flashcard-content">
              <div className="flashcard-content-text">
                <div className="scrollable-text">{this.props.question}</div>
              </div>
            </div>
            <div className="flashcard-footer">Click the card to see the answer!</div>
          </div>
        </div>)
    }
    return (
      <div>
        <div className='flashcard'>
          <div className="flashcard-title">Question: title</div>
          <div className="flashcard-content">
            <div className="flashcard-content-text center-text">
              <div className="scrollable-text">{this.props.answer}</div>
            </div>
          </div>
          <div className="flashcard-footer">How would you describe experience answering this question?</div>
        </div>
        <div className="answer-buttons-container">
          <button className='button-answer' onClick={() => this.onSubmitEvaluation(1)}>No Clue</button>
          <button className='button-answer' onClick={() => this.onSubmitEvaluation(2.5)}>Wrong</button>
          <button className='button-answer' onClick={() => this.onSubmitEvaluation(4.5)}>Good</button>
          <button className='button-answer' onClick={() => this.onSubmitEvaluation(6)}>Easy</button>
        </div>
      </div>)
  }
}

const submitEval = gql`    
    mutation processEvaluation($itemId: String!, $evaluation: Int!){
        processEvaluation(itemId:$itemId, evaluation: $evaluation){
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

const mapStateToProps = (state) => {
  return {
    isAnswerVisible: state.flashcard.isAnswerVisible
  }
}

export default compose(
  connect(mapStateToProps),
  withRouter,
  graphql(submitEval, {
    props: ({ ownProps, mutate }) => ({
      submit: ({ itemId, evaluation }) => mutate({
        variables: {
          itemId,
          evaluation
        },
        updateQueries: {
          CurrentItems: (prev, { mutationResult }) => {
            const updateResults = update(prev, {
              ItemsWithFlashcard: {
                $set: mutationResult.data.processEvaluation
              }
            })
            return updateResults
          }
        },
        refetchQueries: [{
          query: sessionCountQuery
        }]
      })
    })
  })
)(Flashcard)
