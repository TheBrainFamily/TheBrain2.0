import React from 'react'
import { Text, View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import update from 'immutability-helper'
import styles from '../../../styles/styles'
import currentItemsQuery from 'thebrain-shared/graphql/queries/itemsWithFlashcard'
import setUserIsCasualMutation from 'thebrain-shared/graphql/mutations/setUserIsCasual'
import { mutationConnectionHandler } from '../../../components/NoInternet'
import { withRouter } from 'react-router'

class CasualQuestionModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hidden: false
    }
  }

  setUserIsCasual = async (isCasual) => {
    if (!isCasual) {
      this.setState({ hidden: true })
    }
    console.log('casual = ', isCasual)
    await mutationConnectionHandler(this.props.history, async () => {
      this.props.setUserIsCasual(isCasual)
    })
  }

  render () {
    if (this.state.hidden) {
      return null
    }
    return (
      <View style={styles.answerEvaluatorOverlay}>
        <Text style={styles.infoText}>
          This question is marked as hard. Set below to see only the easier ones - but not less interesting!</Text>
        <Text style={styles.infoText}>You can always change this setting on the profile page.</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text onPress={() => this.setUserIsCasual(true)}
            style={[styles.button, { backgroundColor: '#662d91' }]}>Hide hard questions</Text>
          <Text testID='show_hardcore_questions' onPress={() => this.setUserIsCasual(false)}
            style={[styles.button, { backgroundColor: '#62c46c', marginLeft: 5 }]}>Bring them on!</Text>
        </View>
      </View>
    )
  }
}

export default compose(
  connect(),
  withRouter,
  graphql(setUserIsCasualMutation, {
    props: ({ ownProps, mutate }) => ({
      setUserIsCasual: (isCasual) => mutate({
        variables: {
          isCasual
        },
        updateQueries: {
          UserDetails: (prev, { mutationResult }) => {
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
)(CasualQuestionModal)
