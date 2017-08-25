import React from 'react'
import { Text, View } from 'react-native'
import styles from '../styles/styles'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import userDetailsQuery from '../../client/shared/graphql/queries/userDetails'

class Tutorial extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showTutorial: true
    }
  }

  hideTutorialPermanently = () => {
    this.props.hideTutorial()
  }

  hideTutorial = () => {
    this.setState({ showTutorial: false })
  }

  render () {
    const { hasDisabledTutorial } = this.props.userDetails.UserDetails

    return (
        !hasDisabledTutorial && this.state.showTutorial &&
        <View style={styles.answerEvaluatorOverlay}>
          <Text style={styles.infoText}>How would you describe experience answering this question?</Text>
          <Text style={styles.infoText}>
            Rate using one of the four answers.{'\n'}
            Just slide your finger from the center circle to correct button.
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              onPress={this.hideTutorial}
              style={[styles.button, { backgroundColor: '#662d91' }]}
            >OK, go on</Text>
            <Text
              onPress={this.hideTutorialPermanently}
              style={[styles.button, { backgroundColor: '#62c46c', marginLeft: 5}]}
            >Don't show it again</Text>
          </View>
        </View>
    )
  }
}

const hideTutorialQuery = gql`
    mutation hideTutorial {
        hideTutorial {
            hasDisabledTutorial
        }
    }
`

export default compose(
  connect(),
  graphql(hideTutorialQuery, {
    props: ({ ownProps, mutate }) => ({
      hideTutorial: () => mutate({
        refetchQueries: [{
          query: userDetailsQuery
        }]
      })
    })
  }),
  graphql(userDetailsQuery, {
    name: 'userDetails'
  }),
)(Tutorial)