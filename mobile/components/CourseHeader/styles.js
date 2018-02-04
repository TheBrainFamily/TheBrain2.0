// @flow
import { StyleSheet } from 'react-native'
import appStyle from '../../styles/appStyle'

export default StyleSheet.create({
  courseHeader: {
    margin: 0,
    height: appStyle.header.height,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerBorder: {
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
  headerTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Exo2-Bold'
  }
})
