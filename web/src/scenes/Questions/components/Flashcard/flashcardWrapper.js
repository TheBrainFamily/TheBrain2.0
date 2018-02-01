// @flow
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router'

import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import currentItemsQuery from 'thebrain-shared/graphql/queries/itemsWithFlashcard'
import { getGraphqlForProcessEvaluationMutation } from 'thebrain-shared/graphql/mutations/processEvaluation'
import { getGraphqlFotSetUserIsCasualMutation } from 'thebrain-shared/graphql/mutations/setUserIsCasual'

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
  getGraphqlFotSetUserIsCasualMutation(graphql)
)
