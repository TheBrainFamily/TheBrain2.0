import React from 'react';

class Flashcard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {visibleAnswer: false};
    }

    answeredQuestion = () => {
        this.setState({visibleAnswer: true})
    };

    render() {
        return <div>
            <div className="center flashcard">QUESTION : <br/><br/><br/>{this.props.question}</div>

            <br/>
            <br/>

            <div>{!this.state.visibleAnswer ?
                <button className="button-answer" onClick={this.answeredQuestion}>SHOW ANSWER</button> :
                <div className="center flashcard answer">CORRECT ANSWER :<br/><br/>{this.props.answer}</div>}</div>

            <br/>

            <p>How would you describe experience answering this question?</p>

            <button className="button-answer">Blackout</button>
            <button className="button-answer">Terrible</button>
            <button className="button-answer">Bad</button>
            <button className="button-answer">Hardly</button>
            <button className="button-answer">Good</button>
            <button className="button-answer">Perfect!</button>
        </div>
    }
}

export default Flashcard;