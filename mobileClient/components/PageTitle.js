import React from 'react'
import { Text, View } from 'react-native'

import Separator from './Separator'
import appStyle from '../styles/appStyle'

const PageTitle = (props) => (
  <View style={{
    paddingHorizontal: '5%',
    height: appStyle.pageTitle.height
  }}>
    <Text style={style}>
      {props.text}
    </Text>
    <Separator />
  </View>
)

const style = {
  color: '#999',
  fontSize: 16,
  fontFamily: 'Exo2-Bold',
  paddingHorizontal: 20,
  paddingVertical: 5
}

export default PageTitle
