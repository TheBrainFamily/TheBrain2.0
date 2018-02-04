// @flow

import { StyleSheet } from 'react-native'

import appStyle from './appStyle'

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: appStyle.colors.bgAlt
  },
  textDefault: {
    letterSpacing: -1,
    fontSize: 18,
    textAlign: 'center',
    color: appStyle.colors.text,
    fontFamily: 'Kalam-Bold'
  },
  mainPage: {
    backgroundColor: appStyle.colors.bg,
    height: '100%'
  },
  flipCardContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 4},
    shadowRadius: 4,
    shadowOpacity: 0.5,
    marginBottom: 18
  },
  header: {
    height: appStyle.header.height,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    elevation: 5,
    margin: 0,
    paddingTop: 20,
    paddingBottom: 27,
    paddingHorizontal: 20,
    width: '100%'
  },
  headerWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      height: 5
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    backgroundColor: 'white'
  },
  button: {
    fontSize: 14,
    backgroundColor: '#224c8c',
    color: '#FFF',
    padding: 15,
    textAlign: 'center',
    fontFamily: 'Exo2-Bold',
    borderRadius: 23,
    overflow: 'hidden'
  },
  infoText: {
    textAlign: 'center',
    fontFamily: 'Exo2-Regular',
    fontSize: 17
  },
  overlay: {
    position: 'absolute',
    zIndex: 2
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
    padding: '5%'
  }
})

export default styles
