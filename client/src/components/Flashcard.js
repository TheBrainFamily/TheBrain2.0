import React from 'react'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { withRouter } from 'react-router'

import { flashcard } from '../actions'

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
    return <div>
      <div className="center flashcard">QUESTION : <br /><br /><br />{this.props.question}</div>

      <br />
      <br />

      <div>{!this.props.isAnswerVisible ?
        <button className="button-answer" onClick={this.answeredQuestion}>SHOW ANSWER</button> : <div>
          <div className="center flashcard answer">CORRECT ANSWER :<br /><br />{this.props.answer}
          </div>
          <p>How would you describe experience answering this question?</p>
          <br />
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(1)}>No Clue</button>
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(2.5)}>Wrong</button>
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(4.5)}>Good</button>
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(6)}>Easy</button>
        </div>
      }
      </div>
    </div>
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
          evaluation,
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
        }
      })
    })
  })
)(Flashcard)
