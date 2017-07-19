import React from 'react'
import { Text, View } from 'react-native'

import Separator from './Separator'

const PageTitle = (props) => (
  <View style={{
    paddingVertical: 10
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
  paddingHorizontal: 30,
  paddingVertical: 5
}

export default PageTitle
