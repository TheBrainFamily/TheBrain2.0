import _ from 'lodash'
import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'

function getDaysInMonth (month, year = new Date().getFullYear()) {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfMonth (month, year = new Date().getFullYear()) {
  return new Date(year, month, 1).getDay()
}

function isSameDayOfWeek (dayNumber, currentDay = new Date().getDay()) {
  return dayNumber === currentDay
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
          isSunday ? {color: '#a00'} : {},
          isSameDayOfWeek(dayNumber) ? {color: '#662d91'} : {}
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
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const daysInPreviousMonth = getDaysInMonth(currentMonth - 1)
    const daysInCurrentMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth - 1)
    const numberOfDaysFromPreviousMonth = (firstDayOfMonth + 6) % 7
    const days = [
      ..._.range(daysInPreviousMonth + 1 - numberOfDaysFromPreviousMonth, daysInPreviousMonth + 1),
      ..._.range(1, daysInCurrentMonth + 1)
    ]
    const totalNumberOfCalendarDays = 42
    const numberOfDaysFromNextMonth = totalNumberOfCalendarDays - days.length
    days.push(..._.range(1, numberOfDaysFromNextMonth + 1))

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
          {days.map((day, index) => {
            const isSunday = index % 7 === 6
            const dayNumber = (index + 1) % 7
            const isToday = isSameDayOfWeek(dayNumber) && day === new Date().getDate()

            return (
              <View key={`day-${index}`} style={[
                style.calendarDay,
                {zIndex: index - (isToday ? 2 : 0)},
                isToday ? { backgroundColor: '#662d91' } : {}
              ]}>
                {!isSunday &&
                <View style={style.circle} />
                }
                <Text style={[
                  style.smallText,
                  isSunday ? {color: '#a00'} : {},
                  isToday ? {color: '#fff'} : {}
                ]}>{day}</Text>
                <Text style={[
                  style.reviewText,
                  isToday ? {color: '#fff'} : {}
                ]}>99 r.</Text>
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

export default connect()(ReviewsCalendar)
