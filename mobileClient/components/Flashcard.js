import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import {
    Text,
    View,
    Animated,
    TouchableOpacity,
} from 'react-native';
import Emoji from 'react-native-emoji';
import styles from '../styles/styles';

const DIRECTION = {
    1: 'left',
    2: 'up',
    3: 'right',
    4: 'down',
};

class Flashcard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visibleAnswer: false, x: 0,
            y: 0,
        };
        this.toAnswerSide = 180;
        this.toQuestionSide = 0;
    }

    componentWillMount = () => {
        this.animatedValue = new Animated.Value(0);
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        });
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg'],
        })
    };

    animate = (value) => {
        Animated.spring(this.animatedValue, {
            toValue: value,
            friction: 8,
            tension: 10,
        }).start();
    };

    flipCard = () => {
        if (this.state.visibleAnswer) {
            this.animate(this.toQuestionSide);
            this.setState({visibleAnswer: false})
        } else {
            this.animate(this.toAnswerSide);
            this.setState({visibleAnswer: true})
        }
    };

    onSubmitEvaluation = (value) => {
        this.props.submit({
            itemId: this.props.evalItemId,
            evaluation: value
        });
        this.setState({visibleAnswer: false});
        this.flipCard();
    };

    calculateSwipeDirection = (x, y) => {
        const angleDeg = Math.atan2(y - 0, x - 0) * 180 / Math.PI;
        return (Math.round(angleDeg / 90) + 2) % 4 + 1;
    };

    isDragLongEnough = () => {
        const dragLen = this.calculateDragLength(this.state.x, this.state.y);
        return dragLen > 100;
    };

    resetPosition = (e) => {
        const direction = this.calculateSwipeDirection(this.state.x, this.state.y);
        if (this.isDragLongEnough()) {
            this.onSubmitEvaluation(direction);
        }
        this.dragging = false;
        //Reset on release
        this.setState({
            x: 0,
            y: 0,
        })

    };
    _onStartShouldSetResponder = (e) => {
        this.dragging = true;
        //Setup initial drag coordinates
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };
        return true;
    };
    _onMoveShouldSetResponder = (e) => {
        return true;
    };

    calculateDragLength = (x, y) => {
        return Math.sqrt((Math.pow(y, 2) + Math.pow(x, 2)));
    };

    setPosition = (event) => {
        //Update our state with the deltaX/deltaY of the movement
        this.setState({
            x: this.state.x + (event.nativeEvent.pageX - this.drag.x),
            y: this.state.y + (event.nativeEvent.pageY - this.drag.y)
        });

        //Set our drag to be the new position so our delta can be calculated next time correctly
        this.drag.x = event.nativeEvent.pageX;
        this.drag.y = event.nativeEvent.pageY;
    };

    getCardStyle = function () {
        const transform = [{rotateY: this.backInterpolate}, {translateX: this.state.x}, {translateY: this.state.y}];
        return {transform};
    };

    getMarkerStyle = (direction) => {
        const dragLen = this.calculateDragLength(this.state.x, this.state.y);
        const swipeDirection = this.calculateSwipeDirection(this.state.x, this.state.y);
        const swipeDirectionString = DIRECTION[swipeDirection];
        let markerStyle = {};
        if (direction === swipeDirectionString) {
            const alpha = dragLen / 100;
            // const backgroundColor = `rgba(0, 255, 0, ${alpha});`;
            markerStyle = {opacity: alpha};
        }
        return markerStyle;
    };

    render = () => {
        const frontAnimatedStyle = {
            transform: [
                {rotateY: this.frontInterpolate}
            ]
        };

        return (
            <TouchableOpacity style={styles.centerChildren} onPress={() => this.flipCard()}>
                <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                    <Text style={styles.primaryHeader}>QUESTION:</Text>
                    <Text style={[styles.primaryText, styles.flipCardContent]}>{this.props.question}</Text>
                    <Text style={styles.primaryHeader}>SHOW ANSWER</Text>
                </Animated.View>
                <Animated.View style={[this.getCardStyle(), styles.flipCard, styles.flipCardBack]}>
                    <Text style={[styles.upMarker, this.getMarkerStyle('up')]}><Emoji name="pensive"/>️</Text>
                    <Text style={[styles.leftMarker, this.getMarkerStyle('left')]}><Emoji name="fearful"/></Text>
                    <Text style={[styles.downMarker, this.getMarkerStyle('down')]}><Emoji name="innocent"/></Text>
                    <Text style={[styles.rightMarker, this.getMarkerStyle('right')]}><Emoji name="smile"/></Text>
                    { this.state.visibleAnswer && <View onResponderMove={this.setPosition}
                                                        onResponderRelease={this.resetPosition}
                                                        onStartShouldSetResponder={this._onStartShouldSetResponder}
                                                        onMoveShouldSetResponder={this._onMoveShouldSetResponder}>
                        <Text style={styles.primaryHeader}>CORRECT ANSWER:</Text>
                        <Text style={[styles.primaryText, styles.flipCardContent]}>{this.props.answer}</Text>
                        <Text style={styles.primaryHeader}>How would you describe experience answering this
                            question?</Text>
                    </View> }
                </Animated.View>
            </TouchableOpacity>
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
})(Flashcard);

