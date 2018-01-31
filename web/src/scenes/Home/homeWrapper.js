import { connect } from 'react-redux'
import update from 'immutability-helper/index'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'

import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import coursesQuery from 'thebrain-shared/graphql/queries/courses'
import logInWithFacebook from 'thebrain-shared/graphql/mutations/logInWithFacebook'

const selectCourseMutation = gql`
    mutation selectCourse($courseId: String!) {
        selectCourse(courseId: $courseId) {
            selectedCourse
            hasDisabledTutorial
            isCasual
            experience {
                level
                showLevelUp
            }
        }
    }
`

const logInWithTokenMutation = gql`
    mutation logInWithToken($accessToken: String!, $userId: String!, $deviceId: String!) {
        logInWithToken(accessToken:$accessToken, userId:$userId, deviceId:$deviceId) {
            _id, username, activated, email, facebookId, currentAccessToken
        }
    }
`

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const homeWrapper = compose(
  connect(mapStateToProps),
  graphql(currentUserQuery, { name: 'currentUser' }),
  graphql(logInWithTokenMutation, {
    props: ({ ownProps, mutate }) => ({
      logInWithToken: ({ accessToken, userId, deviceId }) => mutate({
        variables: {
          accessToken,
          userId,
          deviceId
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithToken
              }
            })
          }
        },
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(logInWithFacebook, {
    props: ({ ownProps, mutate }) => ({
      logInWithFacebook: ({ accessTokenFb, userIdFb }) => mutate({
        variables: {
          accessTokenFb,
          userIdFb
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithFacebook
              }
            })
          }
        },
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(selectCourseMutation, {
    props: ({ ownProps, mutate }) => ({
      selectCourse: ({ courseId }) => mutate({
        variables: {
          courseId
        },
        updateQueries: {
          UserDetails: (prev, { mutationResult }) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.selectCourse
              }
            })
          }
        }
      })
    })
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(coursesQuery, {
    name: 'courses',
    options: {
      notifyOnNetworkStatusChange: true // workaround to infininte loading after user relog in apollo-client > 1.8
    }
  })
)
