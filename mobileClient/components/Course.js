import React from 'react'
import { View, Image } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'

import courseLogos from '../helpers/courseLogos'

import CircleButton from './CircleButton'
import Lecture from './Lecture'

import currentItemsExistQuery from '../shared/graphql/queries/currentItemsExist'
import WithData from './WithData'

// TODO this is not really a Course, it's just a wrapper around a lecture, isn't it?
class Course extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (!nextProps.data || nextProps.data.loading || nextProps.data.error) {
      return
    }
    if (!nextProps.selectedCourse) {
      nextProps.history.push('/')
    }
    if (nextProps.data.Items.length > 0) {
      nextProps.history.push('/questions')
    }
  }

  render () {
    if (!this.props.selectedCourse) {
      return null
    }
    const courseLogo = courseLogos[this.props.selectedCourse.name]
    const logoScale = 0.75

    return (
      <View style={{
        flex: 1,
        backgroundColor: this.props.backgroundColor,
        alignItems: 'center'
      }}>
        <Lecture closeCourse={this.props.closeCourse} />
        <View style={{position: 'absolute', bottom: 25, alignSelf: 'center'}}>
          <CircleButton radius={45} withStaticCircles>
            <Image
              source={courseLogo.file}
              style={{width: courseLogo.width * logoScale, height: courseLogo.height * logoScale, alignSelf: 'center'}}
            />
          </CircleButton>
        </View>
      </View>
    )
  }
}

// TODO are we ever changing this to something else?
Course.defaultProps = {
  backgroundColor: 'transparent'
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}
export default compose(
  connect(mapStateToProps),
  withRouter,
  graphql(currentItemsExistQuery, {
    options: {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true // workaround to infininte loading after user relog in apoolo-client > 1.8
    }
  })
)(WithData(Course, ['data']))
