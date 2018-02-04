// @flow
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  progressBarContainer: {
    justifyContent: 'center',
    position: 'relative',
    width: '85%',
    height: 20,
    marginVertical: 15
  },
  progressBarTrack: {
    top: 3,
    position: 'relative',
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#0007'
  },
  progressBarProgressLine: {
    position: 'relative',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff'
  },
  progressBarProgressCircle: {
    marginTop: -9,
    position: 'relative',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#fff'
  }
})
