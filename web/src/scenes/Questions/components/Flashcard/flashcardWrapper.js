// @flow
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import update from 'immutability-helper'
import { withRouter } from 'react-router'
import _ from 'lodash'

import sessionCountQuery from 'thebrain-shared/graphql/queries/sessionCount'
import userDetailsQuery from 'thebrain-shared/graphql/queries/userDetails'
import currentUserQuery from 'thebrain-shared/graphql/queries/currentUser'
import currentItemsQuery from 'thebrain-shared/graphql/queries/itemsWithFlashcard'
import submitEval from 'thebrain-shared/graphql/mutations/processEvaluation'
import setUserIsCasualMutation from 'thebrain-shared/graphql/mutations/setUserIsCasual'

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
  graphql(submitEval, {
    props: ({ownProps, mutate}) => ({
      submit: ({itemId, evaluation}) => mutate({
        variables: {
          itemId,
          evaluation
        },
        optimisticResponse: {
          processEvaluation: {
            // Without this fake data we get warnings in the client on every evaluation :-(
            '_id': '-1',
            'flashcardId': '',
            'extraRepeatToday': false,
            'actualTimesRepeated': 0,
            '__typename': 'Item', // this used to be Items, double check that it still works
            'flashcard': {
              '_id': '-1',
              'question': '',
              'answer': '',
              'isCasual': true,
              'image': null,
              'answerImage': null,
              '__typename': 'Flashcard'
            },
            switchFlashcards: true
          }
        },
        update: (proxy, { data: { processEvaluation } }) => {
          const data = proxy.readQuery({ query: currentItemsQuery })
          if (processEvaluation.switchFlashcards) {
            const newFlashcards = [_.last(data.Items)]
            data.Items = newFlashcards
          } else {
            data.Items = processEvaluation
          }
          proxy.writeQuery({ query: currentItemsQuery, data })
        },
        refetchQueries: [{
          query: sessionCountQuery
        }, {
          query: userDetailsQuery
        }
        ]
      })
    })
  }),
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
