import React from 'react';
import {
    Text,
    View
} from 'react-native';
export default class extends React.Component {
    render() {
        const {newFlashcards, repetitions, extraRepetitions} = this.props;

        const left = ((newFlashcards.todo / (newFlashcards.todo + newFlashcards.done)) * 100) || 100;
        const done = ((repetitions.todo / (repetitions.todo + repetitions.done)) * 100) || 100;
        const toBeRepeated = ((extraRepetitions.todo / (extraRepetitions.todo + extraRepetitions.done)) * 100) || 100;

        return <View>

            <Text>Left: {newFlashcards.todo} / {newFlashcards.todo + newFlashcards.done}</Text>

            <Text>Done: {repetitions.todo} / {repetitions.todo + repetitions.done} </Text>

            <Text>To be repeated: {extraRepetitions.todo} / {extraRepetitions.todo + extraRepetitions.done}</Text>
        </View>
    }
}