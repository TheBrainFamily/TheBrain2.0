// @flow
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  triangleTop: {
    top: '34%'
  },
  triangleRight: {
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderRightWidth: 0,
    borderLeftWidth: 12,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: '#b3b3b3',
    top: '48.75%',
    left: '60%'
  },
  triangleBottom: {
    borderBottomWidth: 0,
    borderTopWidth: 12,
    borderBottomColor: 'transparent',
    borderTopColor: '#b3b3b3',
    top: '60%'
  },

  triangleLeft: {
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderRightWidth: 12,
    borderLeftWidth: 0,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: '#b3b3b3',
    borderLeftColor: 'transparent',
    top: '48.75%',
    left: '38%'
  },
  answerFieldTop: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#71b9d3',
    width: 170,
    height: '16%',
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
    backgroundColor: '#62c46c',
    width: '12%',
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
    height: '16%',
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
    backgroundColor: '#ff8533',
    width: '12%',
    height: 170,
    borderRadius: 35,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  answerCircle: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'white',
    top: '50%',
    transform: [{ translateY: -50 }],
    borderWidth: 2,
    borderColor: '#b3b3b3',
    width: 100,
    height: 100,
    borderRadius: 50
  },
  answerText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Kalam-Bold',
    textAlign: 'center',
    width: 100
  },
  answerLeftLine: {
    position: 'absolute',
    top: '50%',
    left: '12%',
    width: '26%',
    height: 2,
    backgroundColor: '#62c46c',
    transform: [{ translateY: -1 }]
  },
  answerTopLine: {
    position: 'absolute',
    alignSelf: 'center',
    top: '12%',
    width: 2,
    height: '24%',
    backgroundColor: '#71b9d3'
  },
  answerRightLine: {
    position: 'absolute',
    top: '50%',
    right: '12%',
    width: '26%',
    height: 2,
    backgroundColor: '#ff8533',
    transform: [{ translateY: -1 }]
  },
  answerBottomLine: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '11.6%',
    width: 2,
    height: '24%',
    backgroundColor: '#c1272d'
  },
  answerEvaluator: {
    position: 'relative',
    backgroundColor: 'white',
    overflow: 'hidden',
    width: '100%',
    height: 200
  }
})
