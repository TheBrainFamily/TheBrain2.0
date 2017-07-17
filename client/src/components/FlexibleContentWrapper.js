// @flow

import React from 'react'

export default class FlexibleContentWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  componentWillMount = () => {
    this.updateDimensions()
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.updateDimensions)
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  calcComponentWidth = (height) => {
    return height - 350
  }

  render () {
    return (
      <div className='flexible-wrapper-container' style={{height: this.calcComponentWidth(this.state.height)}}>
        <div className='flexible-wrapper-content'>
          {this.props.children}
        </div>
      </div>
    )
  }
}
