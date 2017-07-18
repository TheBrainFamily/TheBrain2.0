import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { Text, TouchableOpacity, View } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import Hamburger from 'react-native-hamburger'

import MainMenu from './MainMenu'

import styles from '../styles/styles'
import appStyle from '../styles/appStyle'

class CourseHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  toggleMenu = () => {
    this.setState({active: !this.state.active})
  }

  render () {
    if (!this.props.currentCourse) {
      return <View style={[style.courseHeader, {backgroundColor: this.props.backgroundColor}, {height: this.props.height}]} />
    }
    return (
      <View style={[style.courseHeader, {backgroundColor: this.props.backgroundColor, height: this.props.height}]}>
        <View style={styles.questionHeaderFluxContainer}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={this.props.closeCourse}>
              <SvgUri width='100' height='49' source={require('../images/logo.svg')}/>
            </TouchableOpacity>
            <View style={styles.headerBorder}>
              {!this.props.currentCourse.loading &&
              <Text style={styles.headerTitle}>{this.props.currentCourse.Course.name}</Text>
              }
            </View>
          </View>
          <View style={{marginRight: 15}}>
            <Hamburger active={this.state.active} color='#ffffff' type='spinCross' onPress={this.toggleMenu}/>
          </View>
        </View>

        {this.props.children}

        {this.state.active && <MainMenu topMargin={this.props.height} closeCourse={this.props.closeCourse}/>}
      </View>
    )
  }
}

const style = {
  courseHeader: {
    zIndex: 500,
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
  graphql(currentCourseQuery, {
    name: 'currentCourse',
    skip: props => !props.selectedCourse,
    options: (ownProps) => {
      const selectedCourse = ownProps.selectedCourse._id
      return {
        variables: {_id: selectedCourse},
      }
    }
  }),
)(CourseHeader)
