// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { Link } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login'
import currentUserQuery from './../queries/currentUser';

// const createMessage = gql`
//     mutation addMessage($channelName: String!, $handle: String!, $message: String!) {
//         addMessage(channelName: $channelName, handle: $handle, message:$message) {
//             handle, message
//         }
//     }`;
//

export class WellDone extends React.Component {
  componentDidMount () {
    this.props.lessonWatchedMutation()
  }

  responseFacebook = (response: { accessToken: string }) => {
    console.log(response)
    this.props.logInWithFacebook({ accessToken: response.accessToken })
  }

  render () {
    const showLoginWithFacebook = this.props.currentUser.CurrentUser && this.props.currentUser.CurrentUser.activated === false;
    return <div className="welldone">
      First video done! Click: <Link to={`/questions`}>here</Link> to answer some questions about the video
      {showLoginWithFacebook ?
      <FacebookLogin
        appId="794881630542767"
        autoLoad={false}
        fields="name,email,picture"
        callback={this.responseFacebook} /> : null}
    </div>
  }
}

const lessonWatchedMutationSchema = gql`
    mutation createItemsAndMarkLessonAsWatched{
        createItemsAndMarkLessonAsWatched{
            _id, position, description, flashcardIds, youtubeId
        }
    }
`

const lessonWatchedMutationParams = {
  props: ({ ownProps, mutate }) => ({
    lessonWatchedMutation: () => mutate({
      updateQueries: {
        Lesson: (prev, { mutationResult }) => {
          console.log('JMOZGAWA: mutationResult', mutationResult)
          const updateResults = update(prev, {
            Lesson: {
              $set: mutationResult.data.createItemsAndMarkLessonAsWatched
            }
          })
          return updateResults
        }
      }
    }),
  })
}

// compose(
//     graphql(currentUserQuery, {name: "currentUser"}),
//     graphql(currentItemsQuery, {
//             name: "currentItems",
//             options: {
//                 forceFetch: true,
//             }
//         }
//     ),
// )(Questions)
const logInWithFacebook = gql`
    mutation logInWithFacebook($accessToken: String!){
        logInWithFacebook(accessToken:$accessToken) {
            _id, username, activated
        }
    }
`

export default compose(
  graphql(lessonWatchedMutationSchema, lessonWatchedMutationParams),
  graphql(currentUserQuery, {name: "currentUser"}),
  graphql(logInWithFacebook, {
    props: ({ ownProps, mutate }) => ({
      logInWithFacebook: ({ accessToken }) => mutate({
        variables: {
          accessToken
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            console.log('Gozdecki: mutationResult', mutationResult)
            console.log('Gozdecki: prev', prev)
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithFacebook
              }
            })
          }
        }
      })
    })
  })
)(WellDone)
