// @flow

import React from 'react'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { withRouter } from 'react-router'
import { flashcard } from '../actions'
import sessionCountQuery from '../../shared/graphql/queries/sessionCount'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'
import FlexibleContentWrapper from './FlexibleContentWrapper'
import ResizableImage from './ResizableImage'

import answerButtonImage1 from '../img/button-easy.png'
import answerButtonImage2 from '../img/button-medium.png'
import answerButtonImage3 from '../img/button-hard.png'
import answerButtonImage4 from '../img/button-veryhard.png'
import LevelUpWrapper from './LevelUpWrapper'

class Flashcard extends React.Component {
  answeredQuestion = () => {
    this.props.dispatch(flashcard.showAnswer(true))
  }

  onSubmitEvaluation = (value) => {
    this.props.submit({
      itemId: this.props.evalItemId,
      evaluation: value
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.question !== this.props.question) {
      this.props.dispatch(flashcard.showAnswer(false))
    }
  }

  componentWillMount () {
    this.props.dispatch(flashcard.showAnswer(false))
  }

  render () {
    if (!this.props.isAnswerVisible) {
      return (
        <FlexibleContentWrapper offset={300}>
          <div className='flashcard' style={{cursor: 'pointer'}} onClick={this.answeredQuestion}>
            <div className='flashcard-title'>Question: title</div>
            <div className='flashcard-content'>
              <div className='flashcard-content-text'>
                <div className='scrollable-text'>
                  {this.props.image && <ResizableImage image={this.props.image}/>}
                  {this.props.question}
                </div>
              </div>
            </div>
            <div className='flashcard-footer'>Click the card to see the answer!</div>
          </div>
        </FlexibleContentWrapper>)
    }
    return (
      <div>
        <FlexibleContentWrapper offset={300}>
          <div className='flashcard'>
            <div className='flashcard-title'>Question: title</div>
            <div className='flashcard-content'>
              <div className='flashcard-content-text center-text'>
                <div className='scrollable-text'>{this.props.answer}</div>
              </div>
            </div>
            <div className='flashcard-footer'>How would you describe experience answering this question?</div>
          </div>
        </FlexibleContentWrapper>
        <div className="answer-buttons-container">
          <img alt={'Easy'} src={answerButtonImage1} className='answer-button'
               onClick={() => this.onSubmitEvaluation(6)}/>
          <img alt={'Medium'} src={answerButtonImage2} className='answer-button'
               onClick={() => this.onSubmitEvaluation(4.5)}/>
          <img alt={'Hard'} src={answerButtonImage3} className='answer-button'
               onClick={() => this.onSubmitEvaluation(2.5)}/>
          <img alt={'Very hard'} src={answerButtonImage4} className='answer-button'
               onClick={() => this.onSubmitEvaluation(1)}/>
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
                image {
                  url
                  hasAlpha
                }
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
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  LevelUpWrapper,
  graphql(submitEval, {
    props: ({ownProps, mutate}) => ({
      submit: ({itemId, evaluation}) => mutate({
        variables: {
          itemId,
          evaluation
        },
        updateQueries: {
          CurrentItems: (prev, {mutationResult}) => {
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
        },{
          query: userDetailsQuery
        },
        ]
      })
    })
  })
)(Flashcard)
