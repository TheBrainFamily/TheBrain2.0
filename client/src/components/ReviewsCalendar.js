import _ from 'lodash'
import React from 'react'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import cs from 'classnames'

import FlexibleContentWrapper from './FlexibleContentWrapper'

function getDaysInMonth (month, year = new Date().getFullYear()) {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfMonth (month, year = new Date().getFullYear()) {
  return new Date(year, month, 1).getDay()
}

function isSameDayOfWeek (dayNumber, currentDay = new Date().getDay()) {
  return dayNumber === currentDay
}

function generateDays (start, end, month) {
  return _.range(start, end + 1).map(day => {
    return { day, month }
  })
}
const CalendarHeader = (props) => (
  <div className='calendar-header'>
    {props.dayHeadings.map((day, index) => {
      const isSunday = index % 7 === 6
      const dayNumber = (index + 1) % 7
      const classes = cs({
        'day-heading': true,
        'today': isSameDayOfWeek(dayNumber),
        'sunday': isSunday
      })

      return (
        <span className={classes} key={`dayHeader-${index}`}>{day}</span>
      )
    })}
  </div>
)

CalendarHeader.defaultProps = {
  dayHeadings: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  currentDate: new Date()
}

class ReviewsCalendar extends React.Component {
  render () {
    if (this.props.data.loading) {
      return <div />
    }

    const currentDate = new Date()
    const month = currentDate.toLocaleString('en-us', { month: 'long' }).toUpperCase()
    const year = currentDate.getFullYear()

    // const windowHeight = Dimensions.get('window').height
    // const pageTitleHeight = appStyle.pageTitle.height
    // const height = windowHeight - appStyle.header.totalHeight - pageTitleHeight - appStyle.calendarHeader.height

    const currentMonth = currentDate.getMonth() + 1
    const daysInPreviousMonth = getDaysInMonth(currentMonth - 1)
    const daysInCurrentMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth - 1)
    const numberOfDaysFromPreviousMonth = (firstDayOfMonth + 6) % 7
    const dates = [
      ...generateDays(daysInPreviousMonth + 1 - numberOfDaysFromPreviousMonth, daysInPreviousMonth, currentMonth - 1),
      ...generateDays(1, daysInCurrentMonth, currentMonth)
    ]
    const totalNumberOfCalendarDays = 42
    const numberOfDaysFromNextMonth = totalNumberOfCalendarDays - dates.length
    dates.push(...generateDays(1, numberOfDaysFromNextMonth, currentMonth + 1))

    const reviewsByTimestamp = {}
    this.props.data.Reviews.forEach(review => {
      reviewsByTimestamp[review.ts] = review.count
    })

    return (
      <FlexibleContentWrapper offset={900}>
        <h1>REVIEWS CALENDAR - {month} {year}</h1>
        <div className='calendar-container'>
          <CalendarHeader currentDate={currentDate} />
          <div className='calendar-body'>
            {dates.map((date, index) => {
              const isSunday = index % 7 === 6
              const today = new Date()
              const isCurrentMonth = date.month === today.getMonth() + 1
              const isCurrentDay = date.day === today.getDate()
              const isToday = isCurrentMonth && isCurrentDay
              const timestamp = new Date(Date.UTC(today.getFullYear(), date.month - 1, date.day)).valueOf() / 1000
              const count = _.get(reviewsByTimestamp, timestamp, 0)

              const calendarDayClasses = cs({
                'calendar-day': true,
                'today': isToday
                // { zIndex: index - (isToday ? 2 : 0) }, // fix to display a circle separator on top of a current day tile
              })

              return (
                <div key={`day-${index}`} className={calendarDayClasses}>
                  {!isSunday &&
                  <div style={style.circle}/>
                  }
                  <span style={[
                    style.smallText,
                    isSunday ? { color: '#a00' } : {},
                    isToday ? { color: '#fff' } : {}
                  ]}>{date.day}</span>
                  <span style={[
                    style.reviewText,
                    isToday ? { color: '#fff' } : {}
                  ]}>{count ? `${count} r.` : ''}</span>
                </div>
              )
            })}
          </div>
        </div>
      </FlexibleContentWrapper>
    )
  }
}

const style = {

  smallText: {
    color: '#999',
    fontFamily: 'Exo2-Regular',
    fontSize: 13
  },
  reviewText: {
    color: '#662d91',
    fontFamily: 'Exo2-Bold',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 5
  },
  circle: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  calendarDay: {
    width: `${100 / 7 - 0.01}%`, // -0.01 is needed to display calendar properly on some devices
    padding: 5,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  }
}

const reviewsQuery = gql`
    query Reviews {
        Reviews {
          ts, count
        }
    }
`

export default compose(
  connect(),
  graphql(reviewsQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })
)(ReviewsCalendar)
