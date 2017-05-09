import React from 'react';
import {connect} from 'react-redux';
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
import withProcessEvaluation from '../../client/shared/graphql/mutations/withProcessEvaluation';


class Flashcard extends React.Component {

    constructor(props) {
        super(props);
        this.toAnswerSide = 180;
        this.toQuestionSide = 0;
        const windowDimensions = Dimensions.get('window');
        this.state = {
            windowDimensions: {
                width: windowDimensions.width,
                height: windowDimensions.height,
            },
            dynamicStyles: {
                content: this.getCardDynamicContentStyle(),
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
        const value = this.props.flashcard.visibleAnswer ? this.toQuestionSide : this.toAnswerSide;
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

    getCardDynamicContentStyle = (width, height) => {
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

export default withProcessEvaluation()(connect(state => state)(Flashcard));
