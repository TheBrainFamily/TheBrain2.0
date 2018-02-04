// @flow
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  flipCardContent: {
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  flipCardHeader: {
    height: 24,
    color: 'black',
    fontSize: 12,
    fontFamily: 'Exo2-Bold',
    padding: 5,
    backgroundColor: 'transparent'
  },
  flipCardBody: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  cardText: {
    color: 'black',
    backgroundColor: 'transparent',
    fontFamily: 'Kalam-Regular',
    fontSize: 16,
    padding: 10,
    textAlign: 'center'
  },
  cardImage: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 4},
    shadowRadius: 4,
    shadowOpacity: 0.5,
    alignSelf: 'center'
  }
})
