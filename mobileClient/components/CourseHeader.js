import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import Hamburger from 'react-native-hamburger'

import styles from '../styles/styles'
import appStyle from '../styles/appStyle'
import WithData from './WithData'

import * as mainMenuActions from '../actions/MainMenuActions'

class CourseHeader extends React.Component {
  toggleMenu = () => {
    this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
      visible: !this.props.mainMenu.visible
    }))
  }

  closeCourse = () => {
    this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
      visible: false
    }))
    if ( this.props.isExitAnimationFinished ) {
      this.props.closeCourse()
    }
  }

  render () {
    if (!this.props.currentCourse) {
      return <View style={[style.courseHeader, {backgroundColor: this.props.backgroundColor}, {height: this.props.height}]} />
    }
    return (
      <View style={[style.courseHeader, {backgroundColor: this.props.backgroundColor, height: this.props.height}]}>
        <View style={styles.questionHeaderFluxContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={this.closeCourse}>
              <Image
                style={{ width: 100, height: 49 }}
                source={require('../images/logo.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <View style={styles.headerBorder}>
              {!this.props.currentCourse.loading &&
              <Text style={styles.headerTitle}>{this.props.currentCourse.Course.name}</Text>
              }
            </View>
          </View>
          <View style={{marginRight: 15}}>
            <Hamburger active={this.props.mainMenu.visible} color='#ffffff'
                       type='cross'
                       onPress={this.toggleMenu}/>
          </View>
        </View>

        {this.props.children}
      </View>
    )
  }
}

const style = {
  courseHeader: {
    margin: 0,
    height: appStyle.header.height,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

CourseHeader.defaultProps = {
  backgroundColor: 'transparent',
  height: appStyle.header.height
}

const currentCourseQuery = gql`
    query Course($_id: String!) {
        Course(_id: $_id) {
            _id, name, color
        }
    }
`

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  connect(state => state),
  graphql(currentCourseQuery, {
    name: 'currentCourse',
    skip: props => !props.selectedCourse,
    options: (ownProps) => {
      if(!ownProps.selectedCourse) {
        return false
      }
      const selectedCourse = ownProps.selectedCourse._id
      return {
        variables: {_id: selectedCourse},
      }
    }
  }),
)(WithData(CourseHeader,['currentCourse']))
