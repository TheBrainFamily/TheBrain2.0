// @flow

import React from 'react'
import biology from '../img/biology-icon-inside.png'
import biologySimple from '../img/biology-icon-transparent.png'
import chemistry from '../img/chemistry-icon-inside.png'
import comingSoon from '../img/coming-soon-icon-inside.png'
import chemistrySimple from '../img/chemistry-icon-transparent.png'
import dotsLayer from '../img/dots-for-icons.png'

const iconMap = {
  biology: {
    normal: biology,
    simple: biologySimple
  },
  chemistry: {
    normal: chemistry,
    simple: chemistrySimple
  },
  'computer science': {
    normal: comingSoon
  },
  'history': {
    normal: comingSoon
  }
}

export default class CourseIcon extends React.Component {
  render () {
    const filename = this.props.name.toLowerCase()
    const imageStyle = {
      width: this.props.size,
      height: this.props.size,
      cursor: 'pointer'
    }
    const styleBackground = !iconMap[filename] ? null : {
      width: this.props.size,
      height: this.props.size,
      backgroundImage: this.props.simple ? `url(${iconMap[filename].simple})` : `url(${iconMap[filename].normal})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPositionX: 'center',
      backgroundPositionY: 'middle'
    }

    let divClass = 'course-icon'

    if (this.props.isDisabled) {
      styleBackground.opacity = 0.3
      imageStyle.cursor = 'default'
      divClass = 'course-icon-disabled'
    }

    return (
      <div style={styleBackground}
        className={divClass}
        onClick={this.props.onClick && !this.props.isDisabled ? this.props.onClick(this.props.onClickArgument) : null}>
        { this.props.simple
          ? null
          : <img style={imageStyle}
            alt={this.props.name}
            src={dotsLayer}
          />}
        {this.props.children && this.props.children}
      </div>
    )
  }
}
