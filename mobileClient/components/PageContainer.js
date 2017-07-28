import React from 'react'
import { View} from 'react-native'
import Header from './Header'
import MainMenu from './MainMenu'


export default class PageContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mainMenuActive: false
    }}
  toggleMainMenu = () => {
    this.setState({ mainMenuActive: !this.state.mainMenuActive })
  }
  render() {

    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header toggleMainMenu={this.toggleMainMenu}/>
        {this.state.mainMenuActive ? <MainMenu /> : this.props.children}
      </View>
    )
  }
}
