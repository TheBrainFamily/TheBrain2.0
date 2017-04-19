import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import {
  Text,
  View,
  Button,
  Animated,
  TouchableOpacity,
  AppRegistry,
} from 'react-native';
import styles from '../styles/styles';

class Flashcard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {visibleAnswer: false};
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
  }

  render = () => {
    const frontAnimatedStyle = {
      transform: [
        {rotateY: this.frontInterpolate}
      ]
    };
    const backAnimatedStyle = {
      transform: [
        {rotateY: this.backInterpolate}
      ]
    };

    return (
      <TouchableOpacity style={styles.centerChildren} onPress={() => this.flipCard()}>
        <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
          <Text style={styles.primaryHeader}>QUESTION:</Text>
          <Text style={[styles.primaryText, styles.flipCardContent]}>{this.props.question}</Text>
          <Text style={styles.primaryHeader}>SHOW ANSWER</Text>
        </Animated.View>
        <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>
          { this.state.visibleAnswer && <View>
            <Text style={styles.primaryHeader}>CORRECT ANSWER:</Text>
            <Text style={[styles.primaryText, styles.flipCardContent]}>{this.props.answer}</Text>
            <Text style={styles.primaryHeader}>How would you describe experience answering this question?</Text>
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

