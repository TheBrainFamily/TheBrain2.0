import _ from 'lodash'
import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { StyleSheet, Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import SvgUri from 'react-native-svg-uri'
import Header from './Header'
import CircleButton from './CircleButton'
import CourseHeader from './CourseHeader'
import CourseProgressBar from './CourseProgressBar'
import Course from './Course'

import * as courseActions from '../actions/CourseActions'

import styles from '../styles/styles'
import courseLogos from '../helpers/courseLogos'

import coursesQuery from '../../client/shared/graphql/queries/courses'

class Home extends React.Component {
  constructor (props) {
    super(props)
    const isCourseSelected = !!props.course.selectedCourse || false
    this.state = {
      isCourseSelected,
      isExitAnimationFinished: isCourseSelected
    }
  }

  selectCourse = (course) => async () => {
    this.props.dispatch(courseActions.select(course))
    await this.props.selectCourse({courseId: course._id})
    this.setState({isCourseSelected: true})
    this.refs.courseSelector.fadeOut(1000).then(() => this.setState({isExitAnimationFinished: true}))
  }

  closeCourse = () => {
    this.props.dispatch(courseActions.close())
    this.setState({isCourseSelected: false, isExitAnimationFinished: false})
  }

  render () {
    const {isCourseSelected, isExitAnimationFinished} = this.state
    const {course} = this.props
    const courseColor = _.get(course, 'selectedCourse.color')

    return (
      <View style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: courseColor
      }}>
        {!isExitAnimationFinished && <Header withShadow dynamic hide={isCourseSelected}/>}
        <CourseHeader style={{position: 'absolute'}} onLogoPress={this.closeCourse}>
          <CourseProgressBar />
        </CourseHeader>

        {!isExitAnimationFinished && <Animatable.View style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }} ref='courseSelector'>
          <Text
            style={[styles.textDefault, {
              marginBottom: 30,
              fontSize: 24,
              fontFamily: 'Kalam-Regular'
            }]}>
            Choose a course:
          </Text>
          {!this.props.courses.loading &&
          <View style={{flexDirection: 'row'}}>
            {this.props.courses.Courses.map(course => {
              const courseLogo = courseLogos[course.name]
              const logoSize = courseLogo.scale * 80
              return (
                <View key={course._id} style={{
                  marginHorizontal: 20
                }}>
                  <CircleButton
                    color={course.color}
                    onPress={this.selectCourse(course)}
                  >
                    <SvgUri
                      width={logoSize}
                      height={logoSize}
                      source={courseLogo.file}
                      style={{width: logoSize, height: logoSize, alignSelf: 'center'}}
                    />
                  </CircleButton>
                  <Text style={style.courseTitle}>{course.name}</Text>
                </View>
              )
            })}
          </View>
          }
        </Animatable.View>}

        {isExitAnimationFinished && <Course />}
      </View>
    )
  }
}

const selectCourseMutation = gql`
    mutation selectCourse($courseId: String!) {
        selectCourse(courseId: $courseId) {
            success
        }
    }
`

export default compose(
  connect(state => state),
  graphql(selectCourseMutation, {
    props: ({ownProps, mutate}) => ({
      selectCourse: ({courseId}) => mutate({
        variables: {
          courseId
        }
      })
    })
  }),
  graphql(coursesQuery, {name: 'courses'})
)(Home)

const style = StyleSheet.create({
  courseTitle: {
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Exo2-Regular'
  },
  smallCircle: {
    position: 'absolute',
    top: 0,
    left: 58,
    transform: [{translateX: -10}, {translateY: -10}],
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 10
  }
})
