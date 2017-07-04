// @flow

import { StyleSheet } from 'react-native'

import appStyle from './appStyle'

const styles = StyleSheet.create({
  topContainer: {
    height: appStyle.header.offset,
    backgroundColor: appStyle.colors.bgAlt,
    zIndex: 999
  },
  textDefault: {
    fontSize: 18,
    textAlign: 'center',
    color: appStyle.colors.text,
    fontStyle: 'italic',
    fontFamily: 'Kalam-Bold'
  },
  mainPage: {
    backgroundColor: appStyle.colors.bg,
    height: '100%'
  },
  videoPlaceholder: {
    backgroundColor: appStyle.colors.bgDark,
    alignSelf: 'stretch',
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wellDonePage: {
    backgroundColor: '#662d91',
    height: '100%'
  },
  wellDoneContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wellDoneHeader: {
    height: 60,
    fontSize: 30
  },
  wellDoneContent: {
    color: '#DDD',
    padding: 20,
    height: 150,
    fontSize: 20
  },
  baseMarkerStyle: {
    position: 'absolute',
    opacity: 1,
    zIndex: 100,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    transform: [{scale: 0}],
    borderRadius: 10
  },
  upMarker: {
    top: 5,
    left: '50%'
  },
  rightMarker: {
    top: '50%',
    right: 5
  },
  downMarker: {
    bottom: 100,
    left: '50%'
  },
  leftMarker: {
    top: '50%',
    left: 5
  },
  flipCard: {
    // backfaceVisibility: 'hidden',
    width: '90%',
    // backgroundColor: '#662d91',
    marginLeft: '5%'
  },
  flipCardBack: {
    position: 'absolute'
  },
  flipCardContent: {
    backgroundColor: 'white'
  },
  summaryContainer: {
    height: 25,
    backgroundColor: 'white',
    zIndex: 50,
    flexDirection: 'row',
    margin: 0,
    padding: 5
  },
  summaryRow: {
    fontWeight: 'bold',
    fontSize: 12
  },
  summaryLeftRow: {
    textAlign: 'left',
    width: 100
  },
  summaryCenterRow: {
    textAlign: 'center',
    flex: 1
  },
  summaryRightRow: {
    textAlign: 'right',
    width: 100
  },
  menuOverlay: {
    top: appStyle.header.height,
    width: '100%',
    position: 'absolute',
    backgroundColor: '#68b888ee'
  },
  menuButton: {
    borderColor: '#fff5',
    borderBottomWidth: 1
  },
  menuButtonText: {
    textAlign: 'center',
    padding: 15,
    color: 'white',
    fontFamily: 'Exo2-Bold'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    zIndex: 50,
    margin: 0,
    paddingTop: 40,
    paddingBottom: 27,
    paddingHorizontal: 30
  },
  headerWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      height: 5
    },
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  headerTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Exo2-Bold'
  },
  headerLogo: {
    padding: 0,
    marginLeft: -10,
    marginTop: -25,
    marginBottom: 0,
    width: 250,
    height: 65,
    flex: 1,
    transform: [
      { scale: 0.83 }
    ]
  },
  headerBorder: {
    paddingLeft: 15,
    borderLeftWidth: 0.5,
    borderLeftColor: 'white',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  questionHeaderFluxContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 0,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  primaryHeader: {
    height: 24,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#662d91',
    fontSize: 12,
    padding: 5,
    textAlign: 'center'
  },
  flipCardHeader: {
    height: 24,
    color: '#662d91',
    fontSize: 12,
    fontFamily: 'Exo2-Bold',
    padding: 5
  },
  flipCardBody: {
    height: 140,
    justifyContent: 'center'
  },
  primaryText: {
    color: 'black',
    backgroundColor: 'white',
    fontStyle: 'italic',
    fontFamily: 'Kalam-Regular',
    fontSize: 16,
    padding: 10,
    textAlign: 'center'
  },
  form: {
    marginTop: 20,
    width: '70%'
  },
  errorText: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
    backgroundColor: '#D00',
    marginBottom: 10
  },
  textInputWrapper: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 25
  },
  textInput: {
    height: 35,
    fontSize: 13,
    fontFamily: 'Exo2-Regular',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#FFF',
    padding: 8
  },
  button: {
    fontSize: 14,
    backgroundColor: '#224c8c',
    color: '#FFF',
    padding: 15,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Exo2-Regular',
    borderRadius: 23,
    overflow: 'hidden'
  },
  progressBarTrack: {
    position: 'relative',
    width: '85%',
    height: 3,
    marginVertical: 15,
    borderRadius: 1.5,
    backgroundColor: '#0007'
  },
  progressBarProgressLine: {
    position: 'absolute',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff'
  },
  progressBarProgressCircle: {
    position: 'absolute',
    transform: [{ translateX: -7.5 }, { translateY: -6 }],
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#fff'
  },
  answerEvaluator: {
    position: 'relative',
    backgroundColor: 'white',
    overflow: 'hidden',
    width: '100%',
    height: '48.8%'
  },
  answerTopLine: {
    position: 'absolute',
    alignSelf: 'center',
    top: 50,
    width: 2,
    height: 60,
    backgroundColor: '#71b9d3'
  },
  answerRightLine: {
    position: 'absolute',
    top: '50%',
    right: 50,
    width: 88,
    height: 2,
    backgroundColor: '#ff8533',
    transform: [{ translateY: -1 }]
  },
  answerBottomLine: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
    width: 2,
    height: 60,
    backgroundColor: '#c1272d'
  },
  answerLeftLine: {
    position: 'absolute',
    top: '50%',
    left: 50,
    width: 88,
    height: 2,
    backgroundColor: '#62c46c',
    transform: [{ translateY: -1 }]
  },
  answerFieldTop: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#71b9d3',
    width: 170,
    height: 50,
    borderRadius: 35,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  answerFieldRight: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: [{ translateY: -85 }],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff8533',
    width: 50,
    height: 170,
    borderRadius: 35,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  answerFieldBottom: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c1272d',
    width: 170,
    height: 50,
    borderRadius: 35,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  answerFieldLeft: {
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: [{ translateY: -85 }],
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62c46c',
    width: 50,
    height: 170,
    borderRadius: 35,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  answerText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Kalam-Bold',
    textAlign: 'center',
    width: 100
  },
  answerCircle: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -50 }],
    borderWidth: 2,
    borderColor: '#b3b3b3',
    width: 100,
    height: 100,
    borderRadius: 50
  },
  draggableContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -35 }, { translateY: -35 }]
  },
  answerSwipeBall: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#662d91',
    width: 70,
    height: 70,
    borderRadius: 35
  },
  answerEvaluatorOverlay: {
    position: 'absolute',
    backgroundColor: '#fffd',
    top: 0,
    bottom: 0,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    padding: 40
  },
  infoText: {
    textAlign: 'center',
    fontFamily: 'Exo2-Regular',
    fontSize: 17
  }
})

export default styles
