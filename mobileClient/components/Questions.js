// @flow

import React from 'react';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withRouter} from 'react-router';
// import {compose} from 'recompose';
import _ from 'lodash';
import {
    Text,
View,
} from 'react-native';
import Flashcard from './Flashcard';
import SessionSummary from './SessionSummary';
import currentUserQuery from './../queries/currentUser';

class Questions extends React.Component {
    state: Object;
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidUpdate = () => {
        if (this.props.currentItems.ItemsWithFlashcard &&
            this.props.currentItems.ItemsWithFlashcard.length === 0) {
            if (this.props.currentUser.activated) {
                console.log("going to /");
                this.props.history.push("/");
            } else {
                console.log("going to signup");
                this.props.history.push("/signup");
            }
        }
    };

    render() {
        if (this.props.currentItems.loading || this.props.currentUser.loading) {
            return <Text>Loading...</Text>
        } else {
            const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard;

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

                return (<View>
                    <SessionSummary newFlashcards={{done: 0, todo: itemsCounter.newFlashcard || 0}}
                                    repetitions={{done: 0, todo: itemsCounter.repetition || 0}}
                                    extraRepetitions={{done: 0, todo: itemsCounter.extraRepeat || 0}}
                    />
                    <Flashcard question={flashcard.question} answer={flashcard.answer} evalItemId={evalItem._id}/></View>)
            } else {
                return <Text>Test</Text>
            }
        }
    }
}


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
                _id question answer
            }
        }
    }
`;

export default withRouter(
    compose(
        graphql(currentUserQuery, {name: "currentUser"}),
        graphql(currentItemsQuery, {
                name: "currentItems",
                options: {
                    fetchPolicy: "network-only",
                }
            }
        ),
    )(Questions)
);
