import React from 'react';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import FrontCard from './FrontCard';
import BackCard from './BackCard';
import { calculateSwipeDirection, calculateDragLength } from '../helpers/SwipeHelpers';
import {
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    View,
    Text,
} from 'react-native';
import Emoji from 'react-native-emoji';
import styles from '../styles/styles';
import { updateAnswerVisibility } from '../actions/FlashcardActions';

const DIRECTION = {
  1: 'left',
  2: 'up',
  3: 'right',
  4: 'down',
};

class Flashcard extends React.Component {

    constructor(props) {
        super(props);
        this.toAnswerSide = 180;
        this.toQuestionSide = 0;
        this.state = {
            dynamicStyles: {
                content: this.getCardDynamicContentStyle(),
            }
        };
        this.onLayout = this.onLayout.bind(this);
    }

    interpolateWrapper = ({ inputRange, outputRange }) => {
      return this.animatedValue.interpolate({
        inputRange,
        outputRange,
      });
    };

    componentWillMount = () => {
        this.animatedValue = new Animated.Value(0);
    };

    animate = (value) => {
        Animated.spring(this.animatedValue, {
            toValue: value,
            friction: 8,
            tension: 10,
        }).start();
    };

    flipCard = () => {
        if (this.props.flashcard.visibleAnswer) {
            this.animate(this.toQuestionSide);
            this.props.dispatch(updateAnswerVisibility(false));
        } else {
            this.animate(this.toAnswerSide);
            this.props.dispatch(updateAnswerVisibility(true));
        }
    };

    getMarkerStyle = (direction) => {
        const dragLen = calculateDragLength(this.props.flashcard.x, this.props.flashcard.y);
        const swipeDirection = calculateSwipeDirection(this.props.flashcard.x, this.props.flashcard.y);
        const swipeDirectionString = DIRECTION[swipeDirection];
        let markerStyle = {};
        if (direction === swipeDirectionString) {
            const alpha = dragLen / 100;
            markerStyle = {...markerStyle,
                opacity: alpha * 2, transform: [{scale: alpha}]};
        }
        return markerStyle;
    };

    getCardDynamicContentStyle = () => {
        const { width, height } = Dimensions.get('window');
        const heightOfOtherElements =
            StyleSheet.flatten(styles.topContainer).height +
            StyleSheet.flatten(styles.summaryContainer).height +
            2 * StyleSheet.flatten(styles.primaryHeader).height;
        return {
            height: height - heightOfOtherElements,
        };
    };

    onLayout = () => {
        this.setState({
            dynamicStyles: {
                content: this.getCardDynamicContentStyle(),
            }
        });
    };

    render = () => {
        return (
        <View onLayout={this.onLayout}>
            <Text style={[styles.baseMarkerStyle, styles.upMarker, this.getMarkerStyle('up')]}><Emoji name="pensive"/>Unsure</Text>
            <Text style={[styles.baseMarkerStyle, styles.leftMarker, this.getMarkerStyle('left')]}><Emoji name="fearful"/>Bad</Text>
            <Text style={[styles.baseMarkerStyle, styles.downMarker, this.getMarkerStyle('down')]}><Emoji name="innocent"/>Almost</Text>
            <Text style={[styles.baseMarkerStyle, styles.rightMarker, this.getMarkerStyle('right')]}><Emoji name="smile"/>Good</Text>
            <TouchableOpacity onPress={() => this.flipCard()}>
                <FrontCard dynamicStyles={this.state.dynamicStyles}
                           question={this.props.question} interpolateCb={this.interpolateWrapper}/>
                <BackCard dynamicStyles={this.state.dynamicStyles}
                          interpolateCb={this.interpolateWrapper}
                          flipCardCb={this.flipCard}
                          submitCb={this.props.submit}
                          answer={this.props.answer}
                          evalItemId={this.props.evalItemId}
                />
            </TouchableOpacity>
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