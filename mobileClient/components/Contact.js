import React from 'react'
import { Linking, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import PageContainer from './PageContainer'
import PageTitle from './PageTitle'

class Contact extends React.Component {
  render () {
    return (
      <PageContainer dontUseKeyboarAware={true}>

        <PageTitle text='CONTACT' />

        <Text style={style.text}>Drop us an email at:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:info@thebrain.pro')}>
          <Text style={style.link}>info@thebrain.pro</Text>
        </TouchableOpacity>

        <Text style={style.text}>Find out more about TheBrain team:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('http://team.thebrain.pro')}>
          <Text style={style.link}>http://team.thebrain.pro</Text>
        </TouchableOpacity>
      </PageContainer>
    )
  }
}

const style = {
  text: {
    marginTop: 20,
    textAlign: 'center'
  },
  link: {
    color: '#62c46c',
    padding: 5,
    textAlign: 'center'
  }
}

export default connect()(Contact)
