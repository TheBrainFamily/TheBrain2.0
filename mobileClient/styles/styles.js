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
    centeredContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentBox: {
        padding: 20,
        borderRadius: 10,
    },
    centerChildren: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryContainer: {
        flexDirection: 'row',
        padding: 5,
    },
    summaryLeftRow: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'left',
        width: 150,
    },
    summaryCenterRow: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
        flex: 1,
    },
    summaryRightRow: {
        color: 'black',
        fontWeight: 'bold',
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
    secondaryText: {
        color: 'white',
        backgroundColor: 'steelblue',
        fontSize: 10,
        padding: 5,
        textAlign: 'center',
    },
});
