import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

class Flashcard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {visibleAnswer: false};
    }

    answeredQuestion = () => {
        this.setState({visibleAnswer: true})
    };

    onSubmitEvaluation = (value) => {
        this.props.submit({
            itemId: this.props.evalItemId,
            evaluation: value
        });
        this.setState({visibleAnswer: false})
    }

    render() {
        return <div>
            <div className="center flashcard">QUESTION : <br/><br/><br/>{this.props.question}</div>

            <br/>
            <br/>

            <div>{!this.state.visibleAnswer ?
                <button className="button-answer" onClick={this.answeredQuestion}>SHOW ANSWER</button> :
                    <div>
                        <div className="center flashcard answer">CORRECT ANSWER :<br/><br/>{this.props.answer}
                    </div>
                    <p>How would you describe experience answering this question?</p>
                    <br/>
                    <button className="button-answer" onClick={()=>this.onSubmitEvaluation(1)} >Blackout</button>
                    <button className="button-answer" onClick={()=>this.onSubmitEvaluation(2)} >Terrible</button>
                    <button className="button-answer" onClick={()=>this.onSubmitEvaluation(3)} >Bad</button>
                    <button className="button-answer" onClick={()=>this.onSubmitEvaluation(4)} >Hardly</button>
                    <button className="button-answer" onClick={()=>this.onSubmitEvaluation(5)} >Good</button>
                    <button className="button-answer" onClick={()=>this.onSubmitEvaluation(6)} >Perfect!</button>
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
            }
            flashcard
            {
                _id question answer
            }
        }
    }
`;

export default graphql(submitEval, {
    props: ({ownProps, mutate}) => ({
        submit: ({itemId, evaluation}) => mutate({
            variables: {
                itemId,
                evaluation,
            },
            updateQueries: {
                CurrentItems: (prev, {mutationResult}) => {

                    console.log("JMOZGAWA: mutationResult",mutationResult);
                    const updateResults = update(prev, {
                        ItemsWithFlashcard: {
                            $set: mutationResult.data.processEvaluation
                        }
                    });
                    return updateResults;
                }
            }
        })
    })
})(Flashcard);

