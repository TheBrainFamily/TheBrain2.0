import React from 'react'


export default (Component) => {
  return class LevelUp extends React.Component {
    currentLevel: null

    render () {

      if(this.props.userDetails && this.props.userDetails.UserDetails && this.props.userDetails.UserDetails.experience) {
        if(this.currentLevel && this.props.userDetails.UserDetails.experience.level > this.currentLevel) {
          console.log('###### LVL UP!')
          this.props.history.push('/congratulations')
        }
        this.currentLevel = this.props.userDetails.UserDetails.experience.level
      }


      return (
        <Component {...this.props}/>
      )
    }
  }
}