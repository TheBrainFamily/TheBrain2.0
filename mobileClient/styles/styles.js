import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    flipCard: {
        backfaceVisibility: 'hidden',
        backgroundColor: 'steelblue',
        width: '90%',
    },
    flipCardBack: {
        position: 'absolute',
        backgroundColor: '#DDD',
        width: '90%',
    },
    flipCardContent: {
    },
    centerChildren: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryContainer: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: 'black',
    },
    summaryLeftRow: {
        color: 'white',
        fontSize: 10,
        textAlign: 'left',
        width: 150,
    },
    summaryCenterRow: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
        flex: 1,
    },
    summaryRightRow: {
        color: 'white',
        fontSize: 10,
        textAlign: 'right',
        width: 150,
    },
    primaryHeader: {
        color: 'white',
        backgroundColor: 'steelblue',
        fontSize: 10,
        padding: 5,
        textAlign: 'center',
    },
    primaryText: {
        color: 'black',
        backgroundColor: '#DDD',
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
    },
    secondaryHeader: {
        color: 'white',
        backgroundColor: 'steelblue',
        fontSize: 10,
        padding: 5,
        textAlign: 'center',
    },
    secondaryText: {
        color: 'black',
        backgroundColor: '#DDD',
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
    },
    tertiaryHeader: {
        color: 'black',
        backgroundColor: 'skyblue',
        fontSize: 10,
        padding: 5,
        textAlign: 'center',
    },
});
