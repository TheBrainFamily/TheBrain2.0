// @flow

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  topContainer: {
    height: 20,
    backgroundColor: 'white',
    zIndex: 999
  },
  textDefault: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFF',
    fontStyle: 'italic',
    fontFamily: 'Chalkduster',
    fontWeight: 'bold'
  },
  mainPage: {
    backgroundColor: '#662d91',
    height: '100%'
  },
  videoPlaceholder: {
    backgroundColor: '#000',
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
    backgroundColor: '#662d91',
    marginLeft: '5%',
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    zIndex: 50,
    margin: 0,
    paddingTop: 50,
    paddingBottom: 37,
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
    fontFamily: 'Exo2-Regular'
  },
  headerBorder: {
    paddingLeft: 15,
    borderLeftWidth: 0.5,
    borderLeftColor: 'white',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionHeader: {
    zIndex: 9999,
    margin: 0,
    // padding: 30,
    height: 90,
    width: '100%',
    backgroundColor: '#662d91',
  },
  questionHeaderFluxContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontWeight: '900',
    letterSpacing: -1,
    fontSize: 12,
    padding: 5
  },
  flipCardBody: {
    height: 140,
    justifyContent: 'center'
  },
  primaryText: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 20,
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
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#FFF',
    padding: 8
  },
  button: {
    fontSize: 12,
    backgroundColor: '#224c8c',
    color: '#FFF',
    padding: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 23,
    overflow: 'hidden'
  },
  answerEvaluator: {
    position: 'relative',
    backgroundColor: 'white',
    overflow: 'hidden',
    width: '100%',
    height: '45%'
  },
  answerTopLine: {
    position: 'absolute',
    alignSelf: 'center',
    top: 50,
    width: 2,
    height: 47,
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
    height: 47,
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
    lineHeight: 20,
    fontWeight: 'bold',
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
  answerSwipeBall: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -35 }],
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
    textAlign: 'center',
    padding: 40
  },
  infoText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16
  }
})

export default styles
