// @flow

import React from 'react'
import { push } from 'react-router-redux'

import { flashcard } from '../../../../actions/index'

import FlexibleContentWrapper from '../../../../components/FlexibleContentWrapper'
import ResizableImage from './components/ResizableImage/ResizableImage'

import answerButtonImage1 from './img/button-easy.png'
import answerButtonImage2 from './img/button-correct.png'
import answerButtonImage3 from './img/button-wrong.png'
import answerButtonImage4 from './img/button-noClue.png'
import { flashcardWrapper } from './flashcardWrapper'

class Flashcard extends React.Component {
  state = {
    shouldAnimate: false
  }

  showQuestion = (isVisible) => {
    this.setState({ shouldAnimate: true })
    this.props.dispatch(flashcard.showAnswer(isVisible))
  }

  onSubmitEvaluation = (value, itemId) => {
    if (itemId && this.props.isAnswerVisible) {
      this.props.submit({
        itemId,
        evaluation: value
      })
    } else {
      this.showQuestion(true)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedCourse && !nextProps.selectedCourse._id) {
      nextProps.dispatch(push('/'))
    }

    if (nextProps.currentItems.loading === false &&
      nextProps.currentItems.Items &&
      nextProps.currentItems.Items.length === 0) {
      if (nextProps.currentUser.CurrentUser) {
        if (nextProps.currentUser.CurrentUser.activated) {
          nextProps.dispatch(push('/'))
        } else {
          nextProps.dispatch(push('/signup'))
        }
      }
    }

    // TODO lodash get
    if (nextProps.currentItems.Items && this.props.currentItems.Items &&
      nextProps.currentItems.Items[0] && this.props.currentItems.Items[0] &&
      nextProps.currentItems.Items[0].flashcard.question !== this.props.currentItems.Items[0].flashcard.question) {
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

  renderCasualSwitchPopup = () => {
    return (<div onClick={(e) => e.stopPropagation()} className={'flashcard-not-casual-popup'}>
      <strong>Challenging question!</strong> <br />
      <strong>Casual learner?</strong> Feel free to skip them for more fun ride!
      You will still broaden your mind and impress your friends/coworkers!<br />
      <strong>Preparing for an exam or professional work?</strong> Ignore me and keep rocking!
      <div>You can always change this setting on the <strong>profile</strong> page.</div>
      <p onClick={() => this.setUserIsCasual(true)}>HIDE PRO QUESTIONS</p>
      <p onClick={() => this.setUserIsCasual(false)}>CLOSE THIS POPUP</p>
    </div>)
  }

  renderButtons = (itemId, shouldAnimate) => {
    return (
      <div className={`answer-buttons-container slide-animation ${shouldAnimate ? 'slide-out' : ''}`}>
        <img alt={'No clue'} src={answerButtonImage4} className='answer-button'
          onClick={() => this.onSubmitEvaluation(1, itemId)} />
        <img alt={'Wrong'} src={answerButtonImage3} className='answer-button'
          onClick={() => this.onSubmitEvaluation(2.5, itemId)} />
        <img alt={'Correct'} src={answerButtonImage2} className='answer-button'
          onClick={() => this.onSubmitEvaluation(4.5, itemId)} />
        <img alt={'Easy'} src={answerButtonImage1} className='answer-button'
          onClick={() => this.onSubmitEvaluation(6, itemId)} />
      </div>
    )
  }

  render () {
    let image
    let question = 'Loading...'
    let answer = 'Loading...'
    let itemId = null
    let isCasual = true
    let userIsCasual = false

    if (this.props.currentItems.Items &&
      this.props.currentItems.Items[0]) {
      image = this.props.currentItems.Items[0].flashcard.image
      question = this.props.currentItems.Items[0].flashcard.question
      answer = this.props.currentItems.Items[0].flashcard.answer
      itemId = this.props.currentItems.Items[0]._id
      isCasual = this.props.currentItems.Items[0].flashcard.isCasual
    }

    if (this.props.userDetails && this.props.userDetails.UserDetails) {
      userIsCasual = this.props.userDetails.UserDetails.isCasual
    }

    if (!this.props.isAnswerVisible) {
      return (
        <div>
          <FlexibleContentWrapper offset={300}>
            <div className='flashcard' style={{cursor: 'pointer'}} onClick={() => this.showQuestion(true)}>
              <div className='flashcard-title'>QUESTION
                { !isCasual ? <div className={'flashcard-title-not-casual'}>
                  <div className={'flashcard-title-not-casual-tooltip'}>This is a hard question</div>
                </div> : null }
                {userIsCasual === null && !isCasual
                  ? this.renderCasualSwitchPopup() : null
                }
              </div>
              <div className='flashcard-content'>
                <div className='flashcard-content-text'>
                  <div className='scrollable-text'>
                    {image && <ResizableImage image={image} />}
                    {question}
                  </div>
                </div>
              </div>
              <div className='flashcard-footer'>Click the card to see the answer!</div>
            </div>
          </FlexibleContentWrapper>
          {this.renderButtons(itemId, this.state.shouldAnimate)}
        </div>
      )
    }
    return (
      <div>
        <FlexibleContentWrapper offset={300}>
          <div className='flashcard' style={{cursor: 'pointer'}} onClick={() => this.showQuestion(false)}>
            <div className='flashcard-title'>ANSWER
              { !isCasual ? <div className={'flashcard-title-not-casual'}>
                <div className={'flashcard-title-not-casual-tooltip'}>This is a hard question</div>
              </div> : null }
              {userIsCasual === null && !isCasual
                ? this.renderCasualSwitchPopup() : null
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
        {this.renderButtons(itemId, false)}
      </div>
    )
  }
}

export default flashcardWrapper(Flashcard)
