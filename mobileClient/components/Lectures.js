import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import PageContainer from './PageContainer'
import PageTitle from './PageTitle'
import Video from './Video'

import lessonsQuery from '../../client/shared/graphql/queries/lessons'
import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Lectures extends React.Component {
  renderLecture = ({ item }) => {
    if(!item) {
      return
    }
    return (
      <View style={{ width: '50%',height: 160, paddingHorizontal: 10, paddingVertical:3 }} key={item._id}>
        <View style ={{ height: '75%', width:'100%'}}>
          <Video videoId={item.youtubeId} height='100%'/>
          <View pointerEvents="none" style={item.position >= this.props.currentLesson.Lesson.position ? style.overlay : {}} />
        </View>
        <Text style={style.title}>{item.description}</Text>
      </View>
    )
  }

  render () {
    if (this.props.lessons.loading || this.props.currentLesson.loading) {
      return <View />
    }
    return (
      <PageContainer>

        <PageTitle text='LECTURES LIST' />
        <FlatList
          data={this.props.lessons.Lessons}
          renderItem={this.renderLecture}
          style={{
            paddingHorizontal: 10
          }}
          numColumns={2}
        />
      </PageContainer>
    )
  }
}

const style = {
  title: {
    height: '25%',
    color: '#999',
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    textAlign: 'center'
  },
  overlay: {
    position: 'absolute',
    backgroundColor: '#fffc',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  graphql(currentLessonQuery, {
    name: 'currentLesson',
    options: (ownProps) => {
      const courseId = ownProps.selectedCourse._id
      return ({
        variables: { courseId }
      })
    }
  }),
  graphql(lessonsQuery, {
    name: 'lessons',
    options: (ownProps) => {
      const courseId = ownProps.selectedCourse._id
      return {
        variables: { courseId }
      }
    }
  })
)(Lectures)
