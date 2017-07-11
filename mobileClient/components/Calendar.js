import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import Header from './Header'
import PageTitle from './PageTitle'
import ReviewsCalendar from './ReviewsCalendar'

class Calendar extends React.Component {
  render () {
    const currentDate = new Date()
    const month = currentDate.toLocaleString('en-us', { month: 'long' }).toUpperCase()
    const year = currentDate.getFullYear()

    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />

        <PageTitle text={`REVIEWS CALENDAR - ${month} ${year}`} />

        <ReviewsCalendar />
      </View>
    )
  }
}

export default connect()(Calendar)
