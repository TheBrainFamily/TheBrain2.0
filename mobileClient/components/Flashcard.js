import React from 'react';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import FrontCard from './FrontCard';
import BackCard from './BackCard';
import {
    TouchableOpacity,
    Animated,
} from 'react-native';
import styles from '../styles/styles';
import { updateAnswerVisibility } from '../actions/FlashcardActions';

class Flashcard extends React.Component {

    constructor(props) {
        super(props);
        this.toAnswerSide = 180;
        this.toQuestionSide = 0;
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

    render = () => {
        return (
            <TouchableOpacity style={styles.centerChildren} onPress={() => this.flipCard()}>
                <FrontCard question={this.props.question} interpolateCb={this.interpolateWrapper}/>
                <BackCard interpolateCb={this.interpolateWrapper}
                          flipCardCb={this.flipCard}
                          submitCb={this.props.submit}
                          answer={this.props.answer}
                          evalItemId={this.props.evalItemId}
                />
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
})(connect(state => state)(Flashcard));