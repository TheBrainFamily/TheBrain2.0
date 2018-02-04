import { connect } from 'react-redux'
import update from 'immutability-helper/index'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'

import userDetailsQuery from 'thebrain-shared/graphql/userDetails/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/account/currentUser'
import coursesQuery from 'thebrain-shared/graphql/courses/courses'
import { getGraphqlForLogInWithTokenMutation } from 'thebrain-shared/graphql/account/logInWithToken'
import { getGraphqlForLogInWithFacebookMutation } from 'thebrain-shared/graphql/account/logInWithFacebook'

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

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const homeWrapper = compose(
  connect(mapStateToProps),
  graphql(currentUserQuery, { name: 'currentUser' }),
  getGraphqlForLogInWithTokenMutation(graphql),
  getGraphqlForLogInWithFacebookMutation(graphql),
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
