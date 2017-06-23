import React, { PropTypes } from 'react'
import { StyleSheet, View } from 'react-native'

import appStyle from '../styles/appStyle'

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%'
  }
})

const Page = props => (
  <View
    style={[styles.page, {
      backgroundColor: props.backgroundColor || appStyle.colors.bg
    }]}
  >
    {props.children}
  </View>
)

Page.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string
}

Page.defaultProps = {
  backgroundColor: 'transparent'
}

export default Page
