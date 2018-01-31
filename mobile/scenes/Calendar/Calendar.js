import React from 'react'
import { connect } from 'react-redux'

import PageContainer from '../../components/PageContainer'
import PageTitle from '../../components/PageTitle'
import ReviewsCalendar from './ReviewsCalendar/ReviewsCalendar'

class Calendar extends React.Component {
  monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]

  render () {
    const currentDate = new Date()
    const month = this.monthNames[currentDate.getMonth()]
    const year = currentDate.getFullYear()

    return (
      <PageContainer dontUseKeyboarAware>

        <PageTitle text={`REVIEWS - ${month} ${year}`} />

        <ReviewsCalendar />
      </PageContainer>
    )
  }
}

// TODO do we need to connect here?
export default connect()(Calendar)
