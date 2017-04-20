import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import {
    Text,
    View,
    Button,
    StyleSheet,
    Animated,
    TouchableOpacity,
    AppRegistry,
} from 'react-native';
import Emoji from 'react-native-emoji';

const DIRECTION = {
  LEFT: 1,
  UP: 2,
  RIGHT: 3,
  DOWN: 4,
};

class Flashcard extends React.Component {

    constructor(props) {
        super(props);
        this.styles = StyleSheet.create({
            flipCard: {
                backfaceVisibility: 'hidden',
                width: 350,
                height: 600,
                backgroundColor: '#9ACAF4',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40,
            },
            flipCardBack: {
                position: 'absolute',
                width: 350,
                height: 600,
                backgroundColor: '#E5BA9E',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40,
            },
            upMarker: {
                position: 'absolute',
                top: 5,
                left: '50%',
            },
            rightMarker: {
                position: 'absolute',
                top: '50%',
                right: 5,
            },
            downMarker: {
                position: 'absolute',
                bottom: 5,
                left: '50%',
            },
            leftMarker: {
                position: 'absolute',
                top: '50%',
                left: 5,
            },
        });

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

    isDragLongEnough = (direction) => {
      switch(direction) {
        case DIRECTION.LEFT:
          return this.state.x < -100;
        case DIRECTION.UP:
          return this.state.y < -100;
        case DIRECTION.RIGHT:
          return this.state.x > 100;
        case DIRECTION.DOWN:
          return this.state.y > 100;
      }
      return false;
    };

    resetPosition = (e) => {
        const direction = this.calculateSwipeDirection(this.state.x, this.state.y);
        if(this.isDragLongEnough(direction)) {
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

    render = () => {
        const frontAnimatedStyle = {
            transform: [
                {rotateY: this.frontInterpolate}
            ]
        };

        return (
            <TouchableOpacity onPress={() => this.flipCard()}>
                <Animated.View style={[this.styles.flipCard, frontAnimatedStyle]}>
                    <Text>QUESTION: {this.props.question}</Text>
                    <Text>
                        SHOW ANSWER
                    </Text>
                </Animated.View>
                <Animated.View style={[this.getCardStyle(), this.styles.flipCard, this.styles.flipCardBack]}>
                    <Text style={this.styles.upMarker}><Emoji name="pensive"/></Text>
                    <Text style={this.styles.leftMarker}><Emoji name="fearful"/></Text>
                    <Text style={this.styles.downMarker}><Emoji name="innocent"/></Text>
                    <Text style={this.styles.rightMarker}><Emoji name="smile"/></Text>
                    { this.state.visibleAnswer && <View onResponderMove={this.setPosition}
                                                        onResponderRelease={this.resetPosition}
                                                        onStartShouldSetResponder={this._onStartShouldSetResponder}
                                                        onMoveShouldSetResponder={this._onMoveShouldSetResponder}>
                        <Text >CORRECT ANSWER: {this.props.answer}</Text>
                        <Text >How would you describe experience answering this question?</Text>
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

