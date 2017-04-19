import React from 'react';
import {
    Text,
    View
} from 'react-native';
import styles from '../styles/styles';
export default class extends React.Component {
    render() {
        const {newFlashcards, repetitions, extraRepetitions} = this.props;

        const left = ((newFlashcards.todo / (newFlashcards.todo + newFlashcards.done)) * 100) || 100;
        const done = ((repetitions.todo / (repetitions.todo + repetitions.done)) * 100) || 100;
        const toBeRepeated = ((extraRepetitions.todo / (extraRepetitions.todo + extraRepetitions.done)) * 100) || 100;

        return <View style={styles.summaryContainer}>
            <Text style={styles.summaryLeftRow}>Left: {newFlashcards.todo} / {newFlashcards.todo + newFlashcards.done}</Text>
            <Text style={styles.summaryCenterRow}>Done: {repetitions.todo} / {repetitions.todo + repetitions.done} </Text>
            <Text style={styles.summaryRightRow}>To be repeated: {extraRepetitions.todo} / {extraRepetitions.todo + extraRepetitions.done}</Text>
        </View>
    }
}
