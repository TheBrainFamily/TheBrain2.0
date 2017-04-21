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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEE',
    },
    contentBox: {
        padding: 20,
    },
    summaryContainer: {
        height: 25,
        backgroundColor: 'white',
        zIndex: 50,
        flexDirection: 'row',
        margin: 0,
        padding: 5,
    },
    summaryRow: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    summaryLeftRow: {
        textAlign: 'left',
        width: 100,
    },
    summaryCenterRow: {
        textAlign: 'center',
        flex: 1,
    },
    summaryRightRow: {
        textAlign: 'right',
        width: 100,
    },
    primaryHeader: {
        height: 24,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'steelblue',
        fontSize: 12,
        padding: 5,
        textAlign: 'center',
    },
    primaryText: {
        color: 'black',
        backgroundColor: '#EEE',
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
