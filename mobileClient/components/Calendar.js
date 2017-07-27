import React from 'react'
import {connect} from 'react-redux'

import PageContainer from './PageContainer'
import PageTitle from './PageTitle'
import ReviewsCalendar from './ReviewsCalendar'

class Calendar extends React.Component {
  render() {
    const currentDate = new Date()
    const month = currentDate.toLocaleString('en-us', {month: 'long'}).toUpperCase()
    const year = currentDate.getFullYear()

    return (
      <PageContainer >

        <PageTitle text={`REVIEWS CALENDAR - ${month} ${year}`}/>

        <ReviewsCalendar />
      </PageContainer>
    )
  }
}

export default connect()(Calendar)
