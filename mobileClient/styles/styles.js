import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    flipCard: {
        backfaceVisibility: 'hidden',
        width: 350,
        height: 600,
        backgroundColor: '#9ACAF4',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    flipCardBack: {
        position: 'absolute',
        width: 350,
        height: 600,
        backgroundColor: '#E5BA9E',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    upMarker: {
        position: 'absolute',
        top: 5,
        left: '50%',
        opacity: 0,
    },
    rightMarker: {
        position: 'absolute',
        top: '50%',
        right: 5,
        opacity: 0,
    },
    downMarker: {
        position: 'absolute',
        bottom: 5,
        left: '50%',
        opacity: 0,
    },
    leftMarker: {
        position: 'absolute',
        top: '50%',
        left: 5,
        opacity: 0,
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

export default styles;
