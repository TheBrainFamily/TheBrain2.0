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
                justifyContent: 'center'
            },
            flipCardBack: {
                position: 'absolute',
                width: 350,
                height: 600,
                backgroundColor: '#E5BA9E',
                alignItems: 'center',
                justifyContent: 'center'
            }
        });

        this.state = {
            visibleAnswer: false, x: 0,
            y: 0,
        };
        this.toAnswerSide = 180;
        this.toQuestionSide = 0;
    }

    onSubmitEvaluation = (value) => {
        this.props.submit({
            itemId: this.props.evalItemId,
            evaluation: value
        });
        this.flipCard();
        this.setState({visibleAnswer: false})
    };

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
    }

    animate = (value) => {
        Animated.spring(this.animatedValue, {
            toValue: value,
            friction: 8,
            tension: 10,
        }).start();
    }

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
        this.setState({visibleAnswer: false})
    };
    
    calculateSwipeDirection = (x, y) => {
        const angleDeg = Math.atan2(y - 0, x - 0) * 180 / Math.PI;

        const angleDividedTo4Directions = (Math.round(angleDeg / 90) + 2) % 4;

        let direction;
        switch(angleDividedTo4Directions) {
            case 0:
                direction = 'left';
                break;
            case 1:
                direction = 'up';
                break;
            case 2:
                direction = 'right';
                break;
            case 3:
                direction = 'down';
                break;
        }
        // return direction;
        console.log('PINGWIN: submited value angleDividedTo4Directions + 1', angleDividedTo4Directions + 1);
        this.onSubmitEvaluation(angleDividedTo4Directions + 1);
    };

    resetPosition = (e) => {
        const swipeDirection = this.calculateSwipeDirection(this.state.x, this.state.y);
        console.log('PINGWIN: swipeDirection', swipeDirection);
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
                <Animated.View style={[this.getCardStyle(), this.styles.flipCard, this.styles.flipCardBack]}
                               >
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

