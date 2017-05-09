import React from 'react'
import withProcessEvaluation from '../../shared/graphql/mutations/withProcessEvaluation';

class Flashcard extends React.Component {

  constructor(props) {
    super(props)

    this.state = { visibleAnswer: false }
  }

  answeredQuestion = () => {
    this.setState({ visibleAnswer: true })
  }

  onSubmitEvaluation = (value) => {
    this.props.submit({
      itemId: this.props.evalItemId,
      evaluation: value
    })
    this.setState({ visibleAnswer: false })
  }

  render() {
    return <div>
      <div className="center flashcard">QUESTION : <br /><br /><br />{this.props.question}</div>

      <br />
      <br />

      <div>{!this.state.visibleAnswer ?
        <button className="button-answer" onClick={this.answeredQuestion}>SHOW ANSWER</button> :
        <div>
          <div className="center flashcard answer">CORRECT ANSWER :<br /><br />{this.props.answer}
          </div>
          <p>How would you describe experience answering this question?</p>
          <br />
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(1)}>Blackout</button>
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(2)}>Terrible</button>
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(3)}>Bad</button>
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(4)}>Hardly</button>
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(5)}>Good</button>
          <button className="button-answer" onClick={() => this.onSubmitEvaluation(6)}>Perfect!</button>
        </div>
      }
      </div>
    </div>
  }
}

export default withProcessEvaluation()(Flashcard)

