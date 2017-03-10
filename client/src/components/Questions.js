import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import Flashcard from './Flashcard';
import SessionSummary from './SessionSummary';

class Questions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onEvaluationCompleted = (value)=> {

    }
    
    render() {
        if (this.props.data.loading) {
            return <div>Loading...</div>
        } else {
            const itemsWithFlashcard = this.props.data.ItemsWithFlashcard;

            if (itemsWithFlashcard.length > 0) {
                const flashcard = itemsWithFlashcard[0].flashcard;
                const evalItem = itemsWithFlashcard[0].item;
                return <div className="questions">
                    <SessionSummary newFlashcards={{done: 0, todo: 1}}
                                    repetitions={{done: 0, todo: 1}}
                                    extraRepetitions={{done: 0, todo: 1}}
                    />
                    <Flashcard question={flashcard.question} answer={flashcard.answer} evalItemId={evalItem._id}  onSubmitEvaluation={this.onEvaluationCompleted}/>
                </div>
            } else {
                return <p>THE END</p>

            }

        }

    }
}

const query = gql`
    query CurrentItems {
        ItemsWithFlashcard {
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

export default graphql(query)(Questions);

