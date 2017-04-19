import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import {
    Text,
    View,
    Button,
    StyleSheet,
} from 'react-native';

class Flashcard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {visibleAnswer: false};
    }

    getInitialState = () => {
        return {
            x: 0,
            y: 0
        }
    };

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

    resetPosition = (e) => {
        this.dragging = false;
        //Reset on release
        this.setState({
            x: 0,
            y: 0,
        })
    };
    _onStartShouldSetResponder = (e) => {
        console.log('PINGWIN: _onStartShouldSetResponder');
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
        console.log('PINGWIN: this.state', this.state);
        //Set our drag to be the new position so our delta can be calculated next time correctly
        this.drag.x = event.nativeEvent.pageX;
        this.drag.y = event.nativeEvent.pageY;
    };

    getCardStyle = function () {
        const transform = [{translateX: this.state.x}, {translateY: this.state.y}];
        return {transform: transform};
    };

    render() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            },
            card: {
                borderWidth: 3,
                borderRadius: 3,
                borderColor: '#000',
                width: 300,
                height: 300,
                padding: 10,
                marginTop: 300,
            }
        });

        // const style = this.getCardStyle();
        // console.log('PINGWIN: style', style);
        console.log('PINGWIN: dziala');
        return <View style={styles.container}>
            <View style={[styles.card]}
                  onResponderMove={this.setPosition}
                  onResponderRelease={this.resetPosition}
                  onStartShouldSetResponder={this._onStartShouldSetResponder}
                  onMoveShouldSetResponder={this._onMoveShouldSetResponder}>
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

