import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import Flashcard from './Flashcard';
import SessionSummary from './SessionSummary';

class Questions extends React.Component {
    render() {
        if (this.props.data.loading) {
            return <div>Loading...</div>
        } else {
            const itemsWithFlashcard = this.props.data.ItemsWithFlashcard;
            const flashcard = itemsWithFlashcard[0].flashcard;
            return <div className="questions">
                <SessionSummary newFlashcards={{done: 0, todo: 1}}
                                repetitions={{done: 0, todo: 1}}
                                extraRepetitions={{done: 0, todo: 1}}
                />
                <Flashcard question={flashcard.question} answer={flashcard.answer}/>
            </div>
        }

    }
}

const query = gql`
    query CurrentItems {
        ItemsWithFlashcard {
            item {
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

