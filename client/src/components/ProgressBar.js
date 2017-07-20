import React from 'react'
import CourseIcon from './CourseIcon'
import dot from '../img/dot.png'

export default class ProgressBar extends React.Component {
  constructor (props) {
    super(props)
    this.width = 1024
    this.labelWidth = 170
    this.progress = 0.33
    this.label = 'TODAY\'S PROGRESS'
    this.category = 'biology'
  }

  render () {
    if (this.progress < 0) {
      this.progress = 0
    }
    if (this.progress > 1) {
      this.progress = 1
    }
    const maxWidth = this.width - 2 * this.labelWidth
    const completedWidth = this.progress * maxWidth

    return (
      <div className={'progress-bar'} style={{width: this.width}}>
        <div className={'progress-bar-left-label'} style={{width: this.labelWidth}}>{this.label}</div>
        <div className={'progress-bar-indicators'}>
          <img className={'progress-bar-dot'} style={{left: completedWidth}} src={dot}/>
          <div className={'progress-bar-done'} style={{width: completedWidth}}/>
          <div className={'progress-bar-todo'} style={{width: maxWidth - completedWidth}}/>
        </div>
        <div className={'progress-bar-right-label'} style={{width: this.labelWidth}}>
          {this.category.toUpperCase()}
          <CourseIcon simple={true} size={40} name={this.category}/>
        </div>
      </div>
    )
  }
}
