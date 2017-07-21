import React from 'react'
import { View } from 'react-native'
import { compose } from 'react-apollo'
import { connect } from 'react-redux'
import SvgUri from 'react-native-svg-uri'

import courseLogos from '../helpers/courseLogos'

import MainMenu from './MainMenu'
import CircleButton from './CircleButton'
import Lecture from './Lecture'

class Course extends React.Component {
  render () {

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
        {this.props.mainMenuActive && <MainMenu topMargin={0} closeCourse={this.props.closeCourse}/>}
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
)(Course)
