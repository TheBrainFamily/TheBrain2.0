import _ from 'lodash'
import React from 'react'
import { Text, View, Dimensions, Platform, StatusBar } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'

import appStyle from '../styles/appStyle'
import WithData from './WithData'

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
    justifyContent: 'space-around',
    height: appStyle.calendarHeader.height
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
  getHeaderHeight = () => {
    const actionBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0
    return appStyle.header.offset +
      appStyle.header.height + actionBarHeight
  }

  render () {
    if (this.props.data.loading) {
      return <View />
    }

    const windowHeight = Dimensions.get('window').height
    const pageTitleHeight = appStyle.pageTitle.height
    const height = windowHeight - this.getHeaderHeight() - pageTitleHeight - appStyle.calendarHeader.height

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
      <View style={{ height }}>
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
            const isMonday = index % 7 === 0
            const firstRow = index < 7
            const lastRow = index > 34
            const today = new Date()
            const isCurrentMonth = date.month === today.getMonth() + 1
            const isCurrentDay = date.day === today.getDate()
            const isToday = isCurrentMonth && isCurrentDay
            const timestamp = new Date(Date.UTC(today.getFullYear(), date.month - 1, date.day)).valueOf() / 1000
            const count = _.get(reviewsByTimestamp, timestamp, 0)

            return (
              <View key={`day-${index}`} style={[
                style.calendarDay,
                { zIndex: index - (isToday ? 2 : 0) }, // fix to display a circle separator on top of a current day tile
                isToday ? { backgroundColor: '#662d91' } : {}
              ]}>
                {!isMonday && !firstRow &&
                <View style={[style.circle, style.leftTopCircle]} />}
                {!isSunday && !firstRow &&
                <View style={[style.circle, style.rightTopCircle]} />}
                {!isMonday && !lastRow &&
                <View style={[style.circle, style.leftBottomCircle]} />}
                {!isSunday && !lastRow &&
                <View style={[style.circle, style.rightBottomCircle]} />}
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

    fontSize: 15,
    textAlign: 'center',
    marginBottom: 5
  },
  circle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#ccc'
  },
  leftTopCircle: {
    top: -3,
    left: -3
  },
  rightTopCircle: {
    top: -3,
    right: -3
  },
  leftBottomCircle: {
    bottom: -3,
    left: -3
  },
  rightBottomCircle: {
    bottom: -3,
    right: -3
  },
  calendarDay: {
    width: `${100 / 7 - 0.01}%`, // -0.01 is needed to display calendar properly on some devices
    padding: 5,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc'
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
)(WithData(ReviewsCalendar, ['data']))
