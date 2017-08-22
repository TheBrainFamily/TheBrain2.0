// @flow

import React from 'react'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { flashcard } from '../actions'
import sessionCountQuery from '../../shared/graphql/queries/sessionCount'
import userDetailsQuery from '../../shared/graphql/queries/userDetails'
import currentUserQuery from '../../shared/graphql/queries/currentUser'
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

  onSubmitEvaluation = (value, itemId) => {
    if(itemId) {
      this.props.submit({
        itemId,
        evaluation: value
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.userDetails.UserDetails && !nextProps.userDetails.UserDetails.selectedCourse) {
      nextProps.dispatch(push('/'))
    }

    if (nextProps.currentItems.loading === false
      && nextProps.currentItems.ItemsWithFlashcard
      && nextProps.currentItems.ItemsWithFlashcard.length === 0) {
      console.log('KONIEC FISZEK')
      this.props.clearNotCasual()
      if(nextProps.currentUser.CurrentUser) {
        if (nextProps.currentUser.CurrentUser.activated) {
          nextProps.dispatch(push('/'))
        } else {
          nextProps.dispatch(push('/signup'))
        }
      }
    }

    if (nextProps.currentItems.ItemsWithFlashcard && this.props.currentItems.ItemsWithFlashcard
      && nextProps.currentItems.ItemsWithFlashcard[0] && this.props.currentItems.ItemsWithFlashcard[0]
      && nextProps.currentItems.ItemsWithFlashcard[0].flashcard.question !== this.props.currentItems.ItemsWithFlashcard[0].flashcard.question) {
      this.props.dispatch(flashcard.showAnswer(false))
    }
  }

  componentWillMount () {
    this.props.dispatch(flashcard.showAnswer(false))
  }

  setUserIsCasual = (isCasual) => {
    console.log('casual = ', isCasual)
    this.props.setUserIsCasual(isCasual)
  }

  render () {
    let image;
    let question = 'Loading...'
    let answer = 'Loading...'
    let itemId = null
    let isCasual = false

    if(this.props.currentItems.ItemsWithFlashcard
      && this.props.currentItems.ItemsWithFlashcard[0]) {
      image = this.props.currentItems.ItemsWithFlashcard[0].flashcard.image
      question = this.props.currentItems.ItemsWithFlashcard[0].flashcard.question
      answer = this.props.currentItems.ItemsWithFlashcard[0].flashcard.answer
      itemId = this.props.currentItems.ItemsWithFlashcard[0].item._id
      isCasual = this.props.currentItems.ItemsWithFlashcard[0].flashcard.isCasual
    }

    const casualSwitchPopup = <div onClick={(e) => e.stopPropagation()} className={'flashcard-not-casual-popup'}>
      This question is marked as <strong>hard</strong>. Set below to see only the easier ones - but not less interesting!
      <div>You can always change this setting on the <strong>profile</strong> page.</div>
      <p onClick={() => this.setUserIsCasual(true)}>HIDE HARD QUESTIONS</p>
      <p onClick={() => this.setUserIsCasual(false)}>CLOSE THIS POPUP</p>
    </div>

    if (!this.props.isAnswerVisible) {
      return (
        <FlexibleContentWrapper offset={300}>
          <div className='flashcard' style={{cursor: 'pointer'}} onClick={this.answeredQuestion}>
            <div className='flashcard-title'>Question: title
              { !isCasual ? <div className={'flashcard-title-not-casual'}/> : null }
              {this.props.userDetails.UserDetails.isCasual === null && !isCasual ?
                casualSwitchPopup : null
              }
            </div>
            <div className='flashcard-content'>
              <div className='flashcard-content-text'>
                <div className='scrollable-text'>
                  {image && <ResizableImage image={image}/>}
                  {question}
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
            <div className='flashcard-title'>Question: title
              { !isCasual ? <div className={'flashcard-title-not-casual'}/> : null }
              {this.props.userDetails.UserDetails.isCasual === null && !isCasual ?
                casualSwitchPopup : null
              }
            </div>
            <div className='flashcard-content'>
              <div className='flashcard-content-text center-text'>
                <div className='scrollable-text'>{answer}</div>
              </div>
            </div>
            <div className='flashcard-footer'>How would you describe experience answering this question?</div>
          </div>
        </FlexibleContentWrapper>
        <div className="answer-buttons-container">
          <img alt={'Easy'} src={answerButtonImage1} className='answer-button'
               onClick={() => this.onSubmitEvaluation(6, itemId)}/>
          <img alt={'Medium'} src={answerButtonImage2} className='answer-button'
               onClick={() => this.onSubmitEvaluation(4.5, itemId)}/>
          <img alt={'Hard'} src={answerButtonImage3} className='answer-button'
               onClick={() => this.onSubmitEvaluation(2.5, itemId)}/>
          <img alt={'Very hard'} src={answerButtonImage4} className='answer-button'
               onClick={() => this.onSubmitEvaluation(1, itemId)}/>
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
                _id question answer isCasual
                image {
                  url
                  hasAlpha
                }
            }
        }
    }
`

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
                _id question answer isCasual
                image {
                    url
                    hasAlpha
                }
            }
        }
    }
`

const setUserIsCasualMutation = gql`
  mutation setUserIsCasual($isCasual: Boolean!) {
    setUserIsCasual(isCasual:$isCasual) {
      selectedCourse
      hasDisabledTutorial
      isCasual
      experience {
        level
        showLevelUp
      }
    }
  }
`

const clearNotCasualItemsMutation = gql`
  mutation clearNotCasualItems {
    clearNotCasualItems
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
  LevelUpWrapper,
  graphql(currentUserQuery, {
    name: 'currentUser', options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails', options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(currentItemsQuery, {
    name: 'currentItems',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
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
  }),
  graphql(setUserIsCasualMutation, {
    props: ({ownProps, mutate}) => ({
      setUserIsCasual: (isCasual) => mutate({
        variables: {
          isCasual
        },
        updateQueries: {
          UserDetails: (prev, {mutationResult}) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.setUserIsCasual
              }
            })
          }
        },
        refetchQueries: [{
          query: currentItemsQuery
        }]
      }),
    })
  }),
  graphql(clearNotCasualItemsMutation, {
    props: ({ownProps, mutate}) => ({
      clearNotCasual: () => mutate({
      }),
    })
  }),
)(Flashcard)
