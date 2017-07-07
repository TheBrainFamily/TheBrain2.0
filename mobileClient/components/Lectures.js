import React from 'react'
import { Text, View, FlatList } from 'react-native'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import Header from './Header'
import PageTitle from './PageTitle'
import Video from './Video'

import lessonsQuery from '../../client/shared/graphql/queries/lessons'

class Lectures extends React.Component {
  renderLecture = ({ item }) => {
    return (
      <View style={{ width: '50%', padding: 10 }} key={item._id}>
        <Video videoId={item.youtubeId} height={100}/>
        <Text style={style.title}>{item.description}</Text>
      </View>
    )
  }

  render () {
    if (this.props.lessons.loading) {
      return <View />
    }
    return (
      <View style={{
        height: '100%',
        backgroundColor: 'white'
      }}>
        <Header />

        <PageTitle text='LECTURES LIST'/>
        <FlatList
          data={this.props.lessons.Lessons}
          renderItem={this.renderLecture}
          style={{
            paddingHorizontal: 10
          }}
          numColumns={2}
        />
      </View>
    )
  }
}

const style = {
  title: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
    textAlign: 'center'
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
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
