import React from 'react'
import { connect } from 'react-redux'

import PageContainer from './PageContainer'
import PageTitle from './PageTitle'
import ReviewsCalendar from './ReviewsCalendar'

class Calendar extends React.Component {
  monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]

  render () {
    const currentDate = new Date()
    const month = this.monthNames[currentDate.getMonth()]
    const year = currentDate.getFullYear()

    return (
      <PageContainer >

        <PageTitle text={`REVIEWS - ${month} ${year}`}/>

        <ReviewsCalendar />
      </PageContainer>
    )
  }
}

export default connect()(Calendar)
