import React from 'react'
import DropdownMenu from 'react-dd-menu'
import hamburger from '../img/hamburger-icon.png'

import 'react-dd-menu/dist/react-dd-menu.css'

export default class
  extends React.Component {
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
      toggle: <img className={'menu-icon'} src={hamburger} alt={'MENU'} onClick={this.toggle.bind(this)}/>,
      animate: navigator.userAgent.indexOf("Trident") <= 0,
      enterTimeout: 0,
      leaveTimeout: 0,
      animAlign: 'right',
      size: 'lg',
      align: 'right',
      className: 'dropdown',
    }
    return (
      <DropdownMenu {...menuOptions}>
        {this.props.children}
      </DropdownMenu>
    )
  }
}
