// @flow

import React from 'react'

export default class FlexibleContentWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      childHeight: 0,
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

  calcComponentWidth = (height, childHeight) => {
    const offset = 400
    if(height < childHeight) {
      return childHeight - offset
    }
    return height - offset
  }

  getHeight = (element) => {
    if (element && !this.state.elementHeight) {
      this.setState({ childHeight: element.clientHeight });
    }
  }

  render () {
    return (
      <div className='flexible-wrapper-container' style={{height: this.calcComponentWidth(this.state.height, this.state.childHeight)}}>
        <div className='flexible-wrapper-content' ref={this.getHeight}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
