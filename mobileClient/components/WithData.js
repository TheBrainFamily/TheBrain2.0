import React from 'react'
import { withRouter } from 'react-router'

export default (Component, graphqlDataNames) => {
  return withRouter(class extends React.Component {
    state = { dataLoaded: false, isLoading: false, showRetry: false }

    componentWillReceiveProps = (nextProps) => {
      let networkFailure = false
      graphqlDataNames.forEach(dataName => {
        if (nextProps[dataName] && nextProps[dataName].networkStatus === 8) {
          networkFailure = true
        }
      })

      if (networkFailure !== this.state.showRetry) {
        if (this.props.history.location.pathname !== '/nointernet') {
          this.props.history.push('/nointernet')
        }
        this.setState({ showRetry: networkFailure })
      }
    }

    render () {
      return ( !this.state.showRetry && (<Component {...this.props} />))
    }
  })
}
