// @flow

import React from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  Animated,
} from 'react-native';

import styles from '../styles/styles';
import {updateAnswerVisibility} from '../actions/FlashcardActions';
import { getSwipeDirection, getDragLength, getDirectionEvaluationValue } from '../helpers/SwipeHelpers';

class BackCard extends React.Component {
    backInterpolate: number;
    drag : {
        x: number,
        y: number,
    }
    state: {
        position: {
            x: number,
            y: number,
        }
    }

    constructor(props) {
        super(props);
        this.backInterpolate = props.interpolateCb({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg'],
        });
        this.state = {
            position: {
                x: 0,
                y: 0,
            },
        }
    }

    onSubmitEvaluation = (value) => {
        this.props.submitCb({
            itemId: this.props.evalItemId,
            evaluation: value
        });
        this.props.dispatch(updateAnswerVisibility(false));
        this.props.flipCardCb();
    };

    isDragLongEnough = () => {
        const dragLen = getDragLength(this.state.position.x, this.state.position.y);
        return dragLen > 100;
    };

    resetPosition = (e) => {
        const direction = getSwipeDirection(this.state.position.x, this.state.position.y);
        if (this.isDragLongEnough()) {
            const evaluationValue = getDirectionEvaluationValue(direction);
            this.onSubmitEvaluation(evaluationValue);
        }
        //Reset on release
        this.setState({position: {x: 0, y: 0}});
        const baseSwipeValue = 'left';
        const baseDrag = 0;
        this.props.updateSwipeStateCb(baseSwipeValue, baseDrag);

    };

    setupInitialDrag = (e) => {
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };
    };

    setPosition = (event) => {
        //Update our state with the deltaX/deltaY of the movement
        const x = this.state.position.x + (event.nativeEvent.pageX - this.drag.x);
        const y = this.state.position.y + (event.nativeEvent.pageY - this.drag.y);
        this.setState({position: {x, y}});
        const dragLen = getDragLength(this.state.position.x, this.state.position.y);
        const swipeDirection = getSwipeDirection(this.state.position.x, this.state.position.y);
        this.props.updateSwipeStateCb(swipeDirection, dragLen);

        //Set our drag to be the new position so our delta can be calculated next time correctly
        this.drag.x = event.nativeEvent.pageX;
        this.drag.y = event.nativeEvent.pageY;
    };

    getCardTransformation = function () {
        const transform = [{rotateY: this.backInterpolate}, {translateX: this.state.position.x}, {translateY: this.state.position.y}];
        return {transform};
    };

    render = () => {
        if (!this.props.flashcard.visibleAnswer) {
          return null
        }
        return (
            <Animated.View style={[this.getCardTransformation(), styles.flipCard, styles.flipCardBack]}>
                <View onResponderMove={this.setPosition}
                      onResponderRelease={this.resetPosition}
                      onStartShouldSetResponder={() => true}
                      onMoveShouldSetResponder={() => true}
                      onResponderGrant={this.setupInitialDrag}>
                    <Text style={styles.primaryHeader}>CORRECT ANSWER:</Text>
                    <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
                        <Text style={styles.primaryText}>{this.props.answer}</Text>
                    </View>
                    <Text style={styles.primaryHeader}>SWIPE TO EVALUATE</Text>
                </View>
            </Animated.View>
        )
    }
}

export default connect(state => state)(BackCard);
