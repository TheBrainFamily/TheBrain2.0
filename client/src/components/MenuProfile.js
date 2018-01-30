import React from 'react'
import { graphql, compose } from 'react-apollo'
import cardsGreen from '../img/menu-cards-green.png'
import cardsRed from '../img/menu-cards-red.png'
import sessionCount from 'thebrain-shared/graphql/queries/sessionCount'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import levelConfig from 'thebrain-shared/helpers/levelConfig'

class MenuProfile extends React.Component {
  render () {
    const dueValue = this.props.sessionCount.loading ? 0 : this.props.sessionCount.SessionCount.dueDone
    const dueAll = this.props.sessionCount.loading ? 0 : this.props.sessionCount.SessionCount.dueTotal
    const reviewValue = this.props.sessionCount.loading ? 0 : this.props.sessionCount.SessionCount.reviewDone
    const reviewAll = this.props.sessionCount.loading ? 0 : this.props.sessionCount.SessionCount.reviewTotal
    const name = this.props.currentUser.username.split('@')[0]
    const userLevel = this.props.userDetails.loading || !this.props.userDetails.UserDetails.experience ? 0 : this.props.userDetails.UserDetails.experience.level
    const levelCap = levelConfig.levelCap
    const cappedLevel = Math.min(userLevel, levelCap)
    const profileImage = levelConfig[cappedLevel].file
    const levelName = levelConfig[cappedLevel].name

    return (
      <div className={'menu-profile-container'}>
        { cappedLevel > 0 ? <img className={'menu-profile-image'} src={profileImage} alt={levelName} /> : null }
        <div className={'menu-profile-info'}>
          <p className={'menu-profile-name'}>{name}</p>
          <div className={'menu-profile-stats'}>
            <div>
              DUE<br />
              <span className={'menu-profile-stat-values'}>{dueValue}/{dueAll}</span>
              <br />
              <img src={cardsGreen} alt={''} />
            </div>
            <div>
              REVIEW<br />
              <span className={'menu-profile-stat-values'}>{reviewValue}/{reviewAll}</span>
              <br />
              <img src={cardsRed} alt={''} />
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
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(MenuProfile)
