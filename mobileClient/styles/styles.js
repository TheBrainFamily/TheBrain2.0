import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    topContainer: {
        height: 20,
        backgroundColor: 'white',
        zIndex: 999,
    },
    mainPage: {
        backgroundColor: '#9ACAF4',
        height: '100%',
    },
    flipCard: {
        backfaceVisibility: 'hidden',
        width: '100%',
        height: '100%',
        backgroundColor: '#9ACAF4',
        paddingTop: '50%',
        margin: 0,
    },
    flipCardBack: {
        position: 'absolute',
    },
    baseMarkerStyle: {
        position: 'absolute',
        opacity: 1,
        zIndex: 100,
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        transform: [{scale: 0}],
        borderRadius: 10,
    },
    upMarker: {
        top: 5,
        left: '50%',
    },
    rightMarker: {
        top: '50%',
        right: 5,
    },
    downMarker: {
        bottom: 100,
        left: '50%',
    },
    leftMarker: {
        top: '50%',
        left: 5,
    },
    flipCardContent: {
    },
    contentBox: {
        padding: 20,
        borderRadius: 10,
    },
    summaryContainer: {
        backgroundColor: 'white',
        zIndex: 50,
        flexDirection: 'row',
        margin: 0,
        padding: 5,
    },
    summaryLeftRow: {
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'left',
        width: 150,
    },
    summaryCenterRow: {
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        flex: 1,
    },
    summaryRightRow: {
        fontWeight: 'bold',
        fontSize: 12,
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
