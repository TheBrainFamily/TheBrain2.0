import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import {
    Text,
    View,
    Button,
} from 'react-native';

class Flashcard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {visibleAnswer: false};
    }

    answeredQuestion = () => {
        this.setState({visibleAnswer: true})
    };

    onSubmitEvaluation = (value) => {
        this.props.submit({
            itemId: this.props.evalItemId,
            evaluation: value
        });
        this.setState({visibleAnswer: false})
    };

    render() {
        return <View>
            <Text>QUESTION : {this.props.question}</Text>
            <View>{!this.state.visibleAnswer ?
            <Button
                onPress={this.answeredQuestion}
                title="SHOW ANSWER"
                color="#841584"
                accessibilityLabel="SHOW ANSWER"
            />
                 :
                <View>
                    <Text>CORRECT ANSWER :{this.props.answer}
                    </Text>
                    <Text>How would you describe experience answering this question?</Text>
                    <Button
                        onPress={() => this.onSubmitEvaluation(1)}
                        title="Blackout"
                        color="#841584"
                        accessibilityLabel="Blackout"
                    />
                    <Button
                        onPress={() => this.onSubmitEvaluation(2)}
                        title="Terrible"
                        color="#841584"
                        accessibilityLabel="Terrible"
                    />
                    <Button
                        onPress={() => this.onSubmitEvaluation(3)}
                        title="Bad"
                        color="#841584"
                        accessibilityLabel="Bad"
                    />
                    <Button
                        onPress={() => this.onSubmitEvaluation(4)}
                        title="Hardly"
                        color="#841584"
                        accessibilityLabel="Hardly"
                    />
                    <Button
                        onPress={() => this.onSubmitEvaluation(5)}
                        title="Good"
                        color="#841584"
                        accessibilityLabel="Good"
                    />
                    <Button
                        onPress={() => this.onSubmitEvaluation(6)}
                        title="Perfect!"
                        color="#841584"
                        accessibilityLabel="Perfect!"
                    />
                </View>
            }
            </View>
        </View>
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

