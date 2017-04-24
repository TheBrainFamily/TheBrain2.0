import React from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    Animated,
    TouchableOpacity,
} from 'react-native';

import styles from '../styles/styles';
import {updateAnswerVisibility} from '../actions/FlashcardActions';
import {calculateSwipeDirection, calculateDragLength} from '../helpers/SwipeHelpers';

class BackCard extends React.Component {

    constructor(props) {
        super(props);
        this.toAnswerSide = 180;
        this.toQuestionSide = 0;
        this.backInterpolate = props.interpolateCb({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg'],
        });
        this.state = {
            x: 0,
            y: 0,
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
        const dragLen = calculateDragLength(this.state.x, this.state.y);
        return dragLen > 100;
    };

    resetPosition = (e) => {
        const direction = calculateSwipeDirection(this.state.x, this.state.y);
        if (this.isDragLongEnough()) {
            this.onSubmitEvaluation(direction);
        }
        //Reset on release
        this.setState({x: 0, y: 0});
        const baseSwipeValue = 1;
        const baseDrag = 0;
        this.props.updateSwipeStateCb(baseSwipeValue, baseDrag);

    };
    _onStartShouldSetResponder = (e) => {
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

    setPosition = (event) => {
        //Update our state with the deltaX/deltaY of the movement
        const x = this.state.x + (event.nativeEvent.pageX - this.drag.x)
        const y = this.state.y + (event.nativeEvent.pageY - this.drag.y)
        this.setState({x, y});
        const dragLen = calculateDragLength(this.state.x, this.state.y);
        const swipeDirection = calculateSwipeDirection(this.state.x, this.state.y);
        this.props.updateSwipeStateCb(swipeDirection, dragLen);

        //Set our drag to be the new position so our delta can be calculated next time correctly
        this.drag.x = event.nativeEvent.pageX;
        this.drag.y = event.nativeEvent.pageY;
    };

    getCardTransformation = function () {
        const transform = [{rotateY: this.backInterpolate}, {translateX: this.state.x}, {translateY: this.state.y}];
        return {transform};
    };

    render = () => {
        return (
            <Animated.View style={[this.getCardTransformation(), styles.flipCard, styles.flipCardBack]}>
                { this.props.flashcard.visibleAnswer && <View onResponderMove={this.setPosition}
                                                              onResponderRelease={this.resetPosition}
                                                              onStartShouldSetResponder={this._onStartShouldSetResponder}
                                                              onMoveShouldSetResponder={this._onMoveShouldSetResponder}>
                    <Text style={styles.primaryHeader}>CORRECT ANSWER:</Text>
                    <View style={[styles.flipCardContent, this.props.dynamicStyles.content]}>
                        <Text style={styles.primaryText}>{this.props.answer}</Text>
                    </View>
                    <Text style={styles.primaryHeader}>SWIPE TO EVALUATE</Text>
                </View> }
            </Animated.View>
        )
    }
}

export default connect(state => state)(BackCard);
