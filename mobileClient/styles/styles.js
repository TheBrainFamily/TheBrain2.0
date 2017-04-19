import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
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
