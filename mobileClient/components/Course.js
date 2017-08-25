import React from 'react'
import { View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import SvgUri from 'react-native-svg-uri'
import { withRouter } from 'react-router-native'

import courseLogos from '../helpers/courseLogos'

import CircleButton from './CircleButton'
import Lecture from './Lecture'

import currentItemsExistQuery from '../../client/shared/graphql/queries/currentItemsExist'

class Course extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (!nextProps.data || nextProps.data.loading || nextProps.data.error) {
      return
    }
    if (!nextProps.selectedCourse) {
      nextProps.history.push('/')
    }
    if (nextProps.data.ItemsWithFlashcard.length > 0) {
      nextProps.history.push('/questions')
    }
  }

  render () {
    if(!this.props.selectedCourse) {
      return null
    }
    const courseLogo = courseLogos[this.props.selectedCourse.name]
    const logoSize = courseLogo.scale * 60

    return (
      <View style={{
        flex: 1,
        backgroundColor: this.props.backgroundColor,
        alignItems: 'center'
      }}>
        <Lecture />
        <View style={{position: 'absolute', bottom: 25, alignSelf: 'center'}}>
          <CircleButton radius={45} withStaticCircles>
            <SvgUri
              width={logoSize}
              height={logoSize}
              source={courseLogo.file}
              style={{width: logoSize, height: logoSize, alignSelf: 'center'}}
            />
          </CircleButton>
        </View>
      </View>
    )
  }
}

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
  graphql(currentItemsExistQuery)
)(Course)
