import React from 'react'
import profileImage from '../img/portrait-default.png'
import cardsGreen from '../img/menu-cards-green.png'
import cardsRed from '../img/menu-cards-red.png'

export default class MenuProfile extends React.Component {
  constructor (props) {
    super(props)
    this.name = 'Michał'
    this.level = 'Baby boy'
    this.dueValue = 3
    this.dueAll = 10
    this.reviewValue = 5
    this.reviewAll = 10
  }

  render () {
    return (
      <div className={'menu-profile-container'}>
        <img className={'menu-profile-image'} src={profileImage} alt={this.level}/>
        <div className={'menu-profile-info'}>
          <p className={'menu-profile-name'}>{this.name}</p>
          <div className={'menu-profile-stats'}>
            <div>
              DUE<br/>
              <span className={'menu-profile-stat-values'}>{this.dueValue}/{this.dueAll}</span>
              <br/>
              <img src={cardsGreen} alt={''}/>
            </div>
            <div>
              REVIEW<br/>
              <span className={'menu-profile-stat-values'}>{this.reviewValue}/{this.reviewAll}</span>
              <br/>
              <img src={cardsRed} alt={''}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
