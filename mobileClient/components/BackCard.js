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
        const dragLen = calculateDragLength(this.state.position.x, this.state.position.y);
        return dragLen > 100;
    };

    resetPosition = (e) => {
        const direction = calculateSwipeDirection(this.state.position.x, this.state.position.y);
        if (this.isDragLongEnough()) {
            this.onSubmitEvaluation(direction);
        }
        //Reset on release
        this.setState({position: {x: 0, y: 0}});
        const baseSwipeValue = 1;
        const baseDrag = 0;
        this.props.updateSwipeStateCb(baseSwipeValue, baseDrag);

    };
    
    setupInitialDrag = (e) => {
        //Setup initial drag coordinates
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
        const dragLen = calculateDragLength(this.state.position.x, this.state.position.y);
        const swipeDirection = calculateSwipeDirection(this.state.position.x, this.state.position.y);
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
        return (
            <Animated.View style={[this.getCardTransformation(), styles.flipCard, styles.flipCardBack]}>
                { this.props.flashcard.visibleAnswer && <View onResponderMove={this.setPosition}
                                                              onResponderRelease={this.resetPosition}
                                                              onStartShouldSetResponder={() => true}
                                                              onMoveShouldSetResponder={() => true}
                                                              onResponderGrant={this.setupInitialDrag}>
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
