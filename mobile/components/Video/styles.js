// @flow
import { StyleSheet } from 'react-native'
import appStyle from '../../styles/appStyle'

export default StyleSheet.create({
  videoPlaceholder: {
    backgroundColor: appStyle.colors.bgDark,
    alignSelf: 'stretch',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
