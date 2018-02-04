// @flow
import { StyleSheet } from 'react-native'
import appStyle from '../../styles/appStyle'

export default StyleSheet.create({
  menuOverlay: {
    top: appStyle.header.height,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 500
  }
})
