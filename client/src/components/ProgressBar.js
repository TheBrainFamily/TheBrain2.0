import React from 'react'
import CourseIcon from './CourseIcon'
import dot from '../img/dot.png'

export default class ProgressBar extends React.Component {
  constructor (props) {
    super(props)
    this.labelWidth = 170
  }

  render () {
    let progress = Math.min(Math.max(this.props.progress, 0), 1)
    if(!progress) {
      progress = 0
    }

    const maxWidth = this.props.width - 2 * this.labelWidth
    const completedWidth = progress * maxWidth

    return (
      <div className={'progress-bar'} style={{width: this.props.width}}>
        <div className={'progress-bar-left-label'} style={{width: this.labelWidth}}>{this.props.label}</div>
        <div className={'progress-bar-indicators'}>
          <img className={'progress-bar-dot'} style={{left: completedWidth}} src={dot} alt={''}/>
          <div className={'progress-bar-done'} style={{width: completedWidth}}/>
          <div className={'progress-bar-todo'} style={{width: maxWidth - completedWidth}}/>
        </div>
        <div className={'progress-bar-right-label'} style={{width: this.labelWidth}}>
          {this.props.category.toUpperCase()}
          <CourseIcon simple={true} size={40} name={this.props.category}/>
        </div>
      </div>
    )
  }
}
