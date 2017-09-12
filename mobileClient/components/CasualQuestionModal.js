import React from 'react'
import { Text, View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import update from 'immutability-helper'
import styles from '../styles/styles'
import currentItemsQuery from '../shared/graphql/queries/itemsWithFlashcard'
import setUserIsCasualMutation from '../shared/graphql/mutations/setUserIsCasual'

class CasualQuestionModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hidden: false
    }
  }

  setUserIsCasual = (isCasual) => {
    if(!isCasual) {
      this.setState({hidden: true})
    }
    console.log('casual = ', isCasual)
    this.props.setUserIsCasual(isCasual)
  }

  render () {
    if(this.state.hidden) {
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
        <Text onPress={() => this.setUserIsCasual(false)}
              style={[styles.button, { backgroundColor: '#62c46c', marginLeft: 5 }]}>Don't show it again</Text>
        </View>
      </View>
    )
  }
}

export default compose(
  connect(),
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
      }),
    })
  }),
)(CasualQuestionModal)
