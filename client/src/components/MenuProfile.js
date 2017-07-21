import React from 'react'
import { graphql, compose } from 'react-apollo'
import profileImage from '../img/portrait-default.png'
import cardsGreen from '../img/menu-cards-green.png'
import cardsRed from '../img/menu-cards-red.png'
import sessionCount from '../../shared/graphql/queries/sessionCount'

class MenuProfile extends React.Component {
  constructor (props) {
    super(props)
    this.name = 'Michał'
    this.level = 'Baby boy'
  }

  render () {
    const dueValue = this.props.sessionCount.SessionCount.dueDone
    const dueAll = this.props.sessionCount.SessionCount.dueTotal
    const reviewValue = this.props.sessionCount.SessionCount.reviewDone
    const reviewAll = this.props.sessionCount.SessionCount.dueTotal

    return (
      <div className={'menu-profile-container'}>
        <img className={'menu-profile-image'} src={profileImage} alt={this.level}/>
        <div className={'menu-profile-info'}>
          <p className={'menu-profile-name'}>{this.name}</p>
          <div className={'menu-profile-stats'}>
            <div>
              DUE<br/>
              <span className={'menu-profile-stat-values'}>{dueValue}/{dueAll}</span>
              <br/>
              <img src={cardsGreen} alt={''}/>
            </div>
            <div>
              REVIEW<br/>
              <span className={'menu-profile-stat-values'}>{reviewValue}/{reviewAll}</span>
              <br/>
              <img src={cardsRed} alt={''}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(sessionCount, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(MenuProfile)