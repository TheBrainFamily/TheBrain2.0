/* global __DEV__ */
// @flow

import React from 'react'
import { Animated, Easing, Text, View, BackHandler, TouchableOpacity, Image } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import * as Animatable from 'react-native-animatable'

import Video from '../../../../../../components/Video'
import LevelUpWrapper from '../../../../../../components/LevelUpWrapper'

import styles from '../../../../../../styles/styles'

import lessonWatchedMutationParams from 'thebrain-shared/graphql/mutations/lessonWatchedMutationParams'
import clearNotCasualItems from 'thebrain-shared/graphql/mutations/clearNotCasualItems'
import lessonWatchedMutationSchema from 'thebrain-shared/graphql/queries/lessonWatchedMutation'
import currentLessonQuery from 'thebrain-shared/graphql/queries/currentLesson'
import WithData from '../../../../../../components/WithData'
import { mutationConnectionHandler } from '../../../../../../components/NoInternet'
import Loading from '../../../../../../components/Loading'
import * as mainMenuActions from '../../../../../../actions/MainMenuActions'

class Lecture extends React.Component {
  state = {
    showLecture: false,
    playVideo: false
  }

  componentWillMount () {
    this.infoScale = new Animated.Value(0)
  }

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
    Animated.timing(this.infoScale, {
      toValue: 1,
      duration: 500,
      easing: Easing.elastic(1)
    }).start(() => this.setState({ showLecture: true }))
    if (__DEV__) {
      this.setState({ showLecture: true })
    }
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = () => {
    if (this.props.mainMenu.visible) {
      this.props.dispatch(mainMenuActions.updateMainMenuVisibility({
        visible: false
      }))
      return true
    }
    this.props.closeCourse()
    return true
  }

  onVideoWatched = async () => {
    await mutationConnectionHandler(this.props.history, async () => {
      await this.props.clearNotCasual()
      this.props.lessonWatchedMutation({courseId: this.props.selectedCourse._id}).then(() => {
        this.props.history.push('/questions')
      })
    })
  }

  render () {
    if (this.props.data.error) {
      return (<Text>Error... Check if server is running.</Text>)
    }

    if (this.props.data.loading) {
      return <Loading />
    }

    if (!this.props.data.Lesson) {
      return (
        <View>
          <Text style={[styles.textDefault, { marginTop: 35 }]}>Congratulations!</Text>
          <Text style={[styles.infoText, { color: '#fff', paddingHorizontal: 50 }]}>
            You have watched all available lectures in this course.
          </Text>
        </View>
      )
    }

    return (
      <View style={{ width: '100%' }}>
        <Animated.View style={{ transform: [{ scale: this.infoScale }] }}>
          <Text
            style={[styles.textDefault, {
              marginHorizontal: 20,
              marginVertical: 15,
              width: 220,
              alignSelf: 'center'
            }]}>
            Watch the video and answer some questions
          </Text>
        </Animated.View>

        {this.state.showLecture &&
        <Animatable.View animation='bounceIn' style={{ height: '60%' }}>
          <Video videoId={this.props.data.Lesson.youtubeId} onVideoWatched={this.onVideoWatched}
            loading={this.props.data.loading} />
          <TouchableOpacity style={{position: 'absolute', bottom: 30, right: 5}} testID='skip_lecture_button'
            onPress={this.onVideoWatched}>
            <Image
              source={require(`./images/Icon_skip.png`)}
              style={{height: 50, width: 50, alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </Animatable.View>

        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  connect(state => state),
  withRouter,
  graphql(clearNotCasualItems, {
    props: ({ ownProps, mutate }) => ({
      clearNotCasual: () => mutate({})
    })
  }),
  graphql(currentLessonQuery, {
    options: (ownProps) => {
      const courseId = ownProps.selectedCourse._id
      return ({
        variables: { courseId },
        fetchPolicy: 'network-only'
      })
    }
  }),
  graphql(lessonWatchedMutationSchema, lessonWatchedMutationParams),
  LevelUpWrapper
)(WithData(Lecture, ['data']))
