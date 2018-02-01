// @flow
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import update from 'immutability-helper'
import { withRouter } from 'react-router'

import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import currentItemsQuery from 'thebrain-shared/graphql/queries/itemsWithFlashcard'
import setUserIsCasualMutation from 'thebrain-shared/graphql/mutations/setUserIsCasual'
import { getGraphqlForProcessEvaluationMutation } from 'thebrain-shared/graphql/mutations/processEvaluation'

import LevelUpWrapper from '../../../../components/LevelUpWrapper'

const mapStateToProps = (state) => {
  return {
    isAnswerVisible: state.flashcard.isAnswerVisible,
    selectedCourse: state.course.selectedCourse
  }
}

export const flashcardWrapper = compose(
  connect(mapStateToProps),
  withRouter,
  LevelUpWrapper,
  graphql(currentUserQuery, {
    name: 'currentUser',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  graphql(currentItemsQuery, {
    name: 'currentItems',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  getGraphqlForProcessEvaluationMutation(graphql),
  graphql(setUserIsCasualMutation, {
    props: ({ownProps, mutate}) => ({
      setUserIsCasual: (isCasual) => mutate({
        variables: {
          isCasual
        },
        updateQueries: {
          UserDetails: (prev, {mutationResult}) => {
            return update(prev, {
              UserDetails: {
                $set: mutationResult.data.setUserIsCasual
              }
            })
          }
        },
        refetchQueries: [{
          query: currentItemsQuery
        }]
      })
    })
  })
)
