import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import _ from 'lodash';
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
                const itemsCounter = _.countBy(itemsWithFlashcard, (itemWithFlashcard) => {
                    if (itemWithFlashcard.item.extraRepeatToday) {
                        return "extraRepeat";
                    }
                    if (itemWithFlashcard.item.actualTimesRepeated === 0) {
                        return "newFlashcard";
                    }
                    return "repetition";
                });

                console.log("ItemscounteR", itemsCounter);
                return <div className="questions">
                    <SessionSummary newFlashcards={{done: 0, todo: itemsCounter.newFlashcard || 0 }}
                                    repetitions={{done: 0, todo: itemsCounter.repetition || 0 }}
                                    extraRepetitions={{done: 0, todo: itemsCounter.extraRepeat || 0}}
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
                extraRepeatToday
                actualTimesRepeated
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

