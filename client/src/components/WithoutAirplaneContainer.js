import React from 'react'

export const withoutAirplane = (Component) => {
  return class withoutAirplane extends React.Component {
    render () {
      console.log('JMOZGAWA: withoutAirplane')
      return (
        <div
          className='App'
          style={{
            backgroundImage: 'none'
          }}
        >
          <Component {...this.props} />
        </div>
      )
    }
  }
}
