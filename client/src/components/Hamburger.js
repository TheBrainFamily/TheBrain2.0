import React from 'react'
import DropdownMenu from 'react-dd-menu'

export default class Hamburger extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isMenuOpen: false
    }
  }

  toggle = () => {
    this.setState({isMenuOpen: !this.state.isMenuOpen})
  }

  close = () => {
    this.setState({isMenuOpen: false})
  }

  click = () => {
    console.log('You clicked an item')
  }

  render () {
    let menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close.bind(this),
      toggle: <a type="button" onClick={this.toggle.bind(this)}>Hamburger</a>,
      align: 'right',
    }
    return (
      <DropdownMenu {...menuOptions}>
        {this.props.children}
      </DropdownMenu>
    )
  }
}
