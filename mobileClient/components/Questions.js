// @flow

import React from 'react';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withRouter} from 'react-router';
import {
    Text,
    View,
} from 'react-native';
import Flashcard from './Flashcard';
import SessionSummary from './SessionSummary';
import currentUserQuery from '../../client/shared/graphql/queries/currentUser';
import sessionCountQuery from '../../client/shared/graphql/queries/sessionCount';

class Questions extends React.Component {
    componentDidUpdate = () => {
      if (!this.props.currentItems.loading && !this.props.currentUser.loading) {
            if (this.props.currentItems.ItemsWithFlashcard &&
                this.props.currentItems.ItemsWithFlashcard.length === 0 &&
                this.props.currentUser.CurrentUser) {
                if (this.props.currentUser.CurrentUser.activated) {
                    console.log("going to /");
                    this.props.history.push("/");
                } else {
                    console.log("going to signup");
                    this.props.history.push("/signup");
                }
            }
        }
    };

    render() {
        if (this.props.currentItems.loading || this.props.currentUser.loading || this.props.sessionCount.loading) {
            return <Text>Loading...</Text>
        } else {
            const itemsWithFlashcard = this.props.currentItems.ItemsWithFlashcard;
            const sessionCount = this.props.sessionCount.SessionCount

            if (itemsWithFlashcard.length > 0) {
                const flashcard = itemsWithFlashcard[0].flashcard;
                const evalItem = itemsWithFlashcard[0].item;

                const newFlashcards = { done: sessionCount.newDone, total: sessionCount.newTotal }
                const dueFlashcards = { done: sessionCount.dueDone, total: sessionCount.dueTotal }
                const reviewFlashcards = { done: sessionCount.reviewDone, total: sessionCount.reviewTotal }

                return (<View>
                    <SessionSummary newFlashcards={newFlashcards}
                                    dueFlashcards={dueFlashcards}
                                    reviewFlashcards={reviewFlashcards}
                    />
                    <Flashcard question={flashcard.question} answer={flashcard.answer}
                               evalItemId={evalItem._id}/></View>)
            } else {
                return <Text>no flashcards left</Text>
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
        graphql(sessionCountQuery, {
            name: 'sessionCount',
            options: {
                fetchPolicy: "network-only",
            }
        })
    )(Questions)
);
