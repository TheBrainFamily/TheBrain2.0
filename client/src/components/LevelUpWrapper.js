import React from 'react'

export default (Component) => {
  return class LevelUp extends React.Component {
    constructor(props) {
      super(props)
      console.log('constructing lvl up wrapper with cache', sessionStorage.getItem('userLevelCache'))
    }
    componentWillReceiveProps = (nextProps) => {
      const cachedUserLevel = sessionStorage.getItem('userLevelCache')
      if(nextProps.userDetails && nextProps.userDetails.UserDetails && nextProps.userDetails.UserDetails.experience) {
        if(cachedUserLevel && nextProps.userDetails.UserDetails.experience.level > cachedUserLevel) {
          nextProps.history.push('/congratulations')
        }
        sessionStorage.setItem('userLevelCache', nextProps.userDetails.UserDetails.experience.level)
      }
    }
    render () {
      return (
        <Component {...this.props}/>
      )
    }
  }
}
