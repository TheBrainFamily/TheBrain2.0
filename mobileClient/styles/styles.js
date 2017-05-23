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
  flipCard: {
    backfaceVisibility: 'hidden',
    width: '100%',
    height: '100%',
    backgroundColor: '#9ACAF4',
    margin: 0
  },
  flipCardBack: {
    position: 'absolute'
  },
  wellDonePage: {
    backgroundColor: 'steelblue',
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
  flipCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE'
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
    fontWeight: 'bold',
    fontSize: 16,

  },
  questionHeader: {
    // backgroundColor: 'white',
    zIndex: 50,
    margin: 0,
    padding: 30,
    height: 90,
  },
  questionHeaderFluxContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryHeader: {
    height: 24,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'steelblue',
    fontSize: 12,
    padding: 5,
    textAlign: 'center'
  },
  primaryText: {
    color: 'black',
    backgroundColor: '#EEE',
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
  }
})

export default styles
