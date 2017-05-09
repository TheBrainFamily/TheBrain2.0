// @flow

import React from 'react';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import FrontCard from './FrontCard';
import BackCard from './BackCard';
import EmojiWrapper from './EmojiWrapper';

import {
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    View,
    Text,
} from 'react-native';

import styles from '../styles/styles';
import {updateAnswerVisibility} from '../actions/FlashcardActions';

class Flashcard extends React.Component {
    animatedValue: Animated.Value;
    state: {
        windowDimensions: {
            width: number,
            height: number,
        },
        dynamicStyles: {
            content: Object,
        },
        swipeDirection: number,
        dragLen: number,
    };
    constructor(props: Object) {
        super(props);
        const windowDimensions = Dimensions.get('window');
        this.state = {
            windowDimensions: {
                width: windowDimensions.width,
                height: windowDimensions.height,
            },
            dynamicStyles: {
                content: this.getCardDynamicContentStyle(0, 0),
            },
            swipeDirection: 1,
            dragLen: 0,
        };
    }

    interpolateWrapper = ({inputRange, outputRange}) => {
        return this.animatedValue.interpolate({
            inputRange,
            outputRange,
        });
    };

    componentWillMount = () => {
        this.animatedValue = new Animated.Value(0);
    };

    animate = () => {
        const toAnswerSide = 180;
        const toQuestionSide = 0;
        const value = this.props.flashcard.visibleAnswer ? toQuestionSide : toAnswerSide;
        Animated.spring(this.animatedValue, {
            toValue: value,
            friction: 8,
            tension: 10,
        }).start();
    };

    flipCard = () => {
        if (this.props.flashcard.visibleAnswer) {
            this.props.dispatch(updateAnswerVisibility(false));
        } else {
            this.props.dispatch(updateAnswerVisibility(true));
        }
    };

    updateSwipeState = (swipeDirection, dragLen) => {
        this.setState({
            swipeDirection,
            dragLen
        });
    };

    componentWillUpdate = (nextProps) => {
        if (nextProps.flashcard.visibleAnswer !== this.props.flashcard.visibleAnswer) {
            this.animate();
        }
    };

    getCardDynamicContentStyle = (width: number, height: number) => {
        const heightOfOtherElements =
            StyleSheet.flatten(styles.topContainer).height +
            StyleSheet.flatten(styles.summaryContainer).height +
            2 * StyleSheet.flatten(styles.primaryHeader).height;
        return {
            height: height - heightOfOtherElements,
        };
    };

    onLayout = () => {
        const {width, height} = Dimensions.get('window');
        this.setState({
            windowDimensions: {
                width,
                height,
            },
            dynamicStyles: {
                content: this.getCardDynamicContentStyle(width, height),
            }
        });
    };

    render = () => {
        return (
            <View onLayout={this.onLayout}>
                <EmojiWrapper windowDimensions={this.state.windowDimensions}
                              dragLen={this.state.dragLen}
                              swipeDirection={this.state.swipeDirection}/>
                <View>
                    <TouchableOpacity onPress={() => this.flipCard()}>
                        <FrontCard dynamicStyles={this.state.dynamicStyles}
                                   question={this.props.question} interpolateCb={this.interpolateWrapper}/>
                        <BackCard dynamicStyles={this.state.dynamicStyles}
                                  interpolateCb={this.interpolateWrapper}
                                  flipCardCb={this.flipCard}
                                  submitCb={this.props.submit}
                                  updateSwipeStateCb={this.updateSwipeState}
                                  answer={this.props.answer}
                                  evalItemId={this.props.evalItemId}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const submitEval = gql`
    mutation processEvaluation($itemId: String!, $evaluation: Int!){
        processEvaluation(itemId:$itemId, evaluation: $evaluation){
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

export default graphql(submitEval, {
    props: ({ownProps, mutate}) => ({
        submit: ({itemId, evaluation}) => mutate({
            variables: {
                itemId,
                evaluation,
            },
            updateQueries: {
                CurrentItems: (prev, {mutationResult}) => {
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
})(connect(state => state)(Flashcard));
