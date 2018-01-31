// @flow

import React from 'react'
import FlexibleContentWrapper from '../../components/FlexibleContentWrapper'

import _ from 'lodash'

import levelConfig from 'thebrain-shared/helpers/levelConfig'
import { congratulationsWrapper } from './congratulationsWrapper'

class Congratulations extends React.Component {
  click = () => {
    this.props.confirmLevelUp()
  }

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.userDetails.UserDetails.experience.showLevelUp) {
      this.props.history.push('/questions')
    }
  }

  render () {
    const username = _.get(this.props, 'currentUser.CurrentUser.username', 'Guest')
    const userLevel = _.get(this.props, 'userDetails.UserDetails.experience.level', 1)
    const levelCap = levelConfig.levelCap
    const level = Math.min(userLevel, levelCap)

    return (
      <FlexibleContentWrapper>

        <h2>Congratulations {username}!</h2>

        <img className={'levelUpImage'}
          src={levelConfig[level].file}
          alt={levelConfig[level].name}
        />

        <h2>You've just became<br />

          {levelConfig[level].name} (level {userLevel})</h2>
        <div className={'confirm-level-up-button'} onClick={this.click}>Continue learning!</div>
      </FlexibleContentWrapper>
    )
  }
}

export default congratulationsWrapper(Congratulations)
