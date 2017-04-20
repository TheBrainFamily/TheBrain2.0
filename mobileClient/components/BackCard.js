import React from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';

import styles from '../styles/styles';
import { updateAnswerVisibility, updatePosition } from '../actions/FlashcardActions';
import { calculateSwipeDirection, calculateDragLength } from '../helpers/SwipeHelpers';

class BackCard extends React.Component {

  constructor(props) {
    super(props);
    this.toAnswerSide = 180;
    this.toQuestionSide = 0;
    this.backInterpolate = props.interpolateCb({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    })
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
    const dragLen = calculateDragLength(this.props.flashcard.x, this.props.flashcard.y);
    return dragLen > 100;
  };

  resetPosition = (e) => {
    const direction = calculateSwipeDirection(this.props.flashcard.x, this.props.flashcard.y);
    if (this.isDragLongEnough()) {
      this.onSubmitEvaluation(direction);
    }
    this.dragging = false;
    //Reset on release
    this.props.dispatch(updatePosition(0, 0));

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

  setPosition = (event) => {
    //Update our state with the deltaX/deltaY of the movement
    const x = this.props.flashcard.x + (event.nativeEvent.pageX - this.drag.x)
    const y = this.props.flashcard.y + (event.nativeEvent.pageY - this.drag.y)
    this.props.dispatch(updatePosition(x, y));

    //Set our drag to be the new position so our delta can be calculated next time correctly
    this.drag.x = event.nativeEvent.pageX;
    this.drag.y = event.nativeEvent.pageY;
  };

  getCardStyle = function () {
    const transform = [{rotateY: this.backInterpolate}, {translateX: this.props.flashcard.x}, {translateY: this.props.flashcard.y}];
    return {transform};
  };

  render = () => {
    return (
      <Animated.View style={[this.getCardStyle(), styles.flipCard, styles.flipCardBack]}>
        { this.props.flashcard.visibleAnswer && <View onResponderMove={this.setPosition}
                                            onResponderRelease={this.resetPosition}
                                            onStartShouldSetResponder={this._onStartShouldSetResponder}
                                            onMoveShouldSetResponder={this._onMoveShouldSetResponder}>
          <Text style={styles.primaryHeader}>CORRECT ANSWER:</Text>
          <Text style={[styles.primaryText, styles.flipCardContent]}>{this.props.answer}</Text>
          <Text style={styles.primaryHeader}>How would you describe experience answering this question?</Text>
        </View> }
      </Animated.View>
    )
  }
}

export default connect(state => state)(BackCard);
