import React, { PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router'
import Flashcard from './Flashcard';
import SessionSummary from './SessionSummary';

class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                    <Flashcard question={flashcard.question} answer={flashcard.answer} evalItemId={evalItem._id}/>
                </div>
            } else {
                this.props.history.push("/");
                return <div></div>
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

export default withRouter(graphql(query, {
    options: {
        forceFetch: true,
    }
})(Questions));

