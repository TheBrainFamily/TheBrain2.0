import _ from 'lodash'
import React from 'react'
import { Text, View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'

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
  <View style={{
    flexDirection: 'row',
    justifyContent: 'space-around'
  }}>
    {props.dayHeadings.map((day, index) => {
      const isSunday = index % 7 === 6
      const dayNumber = (index + 1) % 7

      return (
        <Text key={`dayHeader-${index}`} style={[
          style.text,
          isSunday ? { color: '#a00' } : {},
          isSameDayOfWeek(dayNumber) ? { color: '#662d91' } : {}
        ]}>{day}</Text>
      )
    })}
  </View>
)

CalendarHeader.defaultProps = {
  dayHeadings: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  currentDate: new Date()
}

class ReviewsCalendar extends React.Component {
  render () {
    if (this.props.data.loading) {
      return <View />
    }

    const currentDate = new Date()
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
      <View style={{
        height: '72.3%',
        backgroundColor: 'white'
      }}>
        <CalendarHeader currentDate={currentDate} />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          alignContent: 'stretch',
          height: '100%'
        }}>
          {dates.map((date, index) => {
            const isSunday = index % 7 === 6
            const today = new Date()
            const isCurrentMonth = date.month === today.getMonth() + 1
            const isCurrentDay = date.day === today.getDate()
            const isToday = isCurrentMonth && isCurrentDay
            const timestamp = new Date(Date.UTC(today.getFullYear(), date.month - 1, date.day)).valueOf() / 1000
            const count = _.get(reviewsByTimestamp, timestamp, 0)

            return (
              <View key={`day-${index}`} style={[
                style.calendarDay,
                { zIndex: index - (isToday ? 2 : 0) },
                isToday ? { backgroundColor: '#662d91' } : {}
              ]}>
                {!isSunday &&
                <View style={style.circle} />
                }
                <Text style={[
                  style.smallText,
                  isSunday ? { color: '#a00' } : {},
                  isToday ? { color: '#fff' } : {}
                ]}>{date.day}</Text>
                <Text style={[
                  style.reviewText,
                  isToday ? { color: '#fff' } : {}
                ]}>{count ? `${count} r.` : ''}</Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}

const style = {
  text: {
    color: '#999',
    fontFamily: 'Exo2-Bold',
    padding: 5,
    textAlign: 'center'
  },
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
    width: `${100 / 7}%`,
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
  graphql(reviewsQuery)
)(ReviewsCalendar)
