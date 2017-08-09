import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable'

import SwipeBall from './SwipeBall'
import LevelUpWrapper from '../../client/shared/components/LevelUpWrapper'
import { withRouter } from 'react-router'

import styles from '../styles/styles'

console.disableYellowBox = true

class AnswerEvaluator extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showTutorial: true
    }
  }

  hideTutorial = () => {
    this.setState({ showTutorial: false })
  }

  hideTutorialPermanently = () => {
    this.props.hideTutorial()
  }

  render () {
    if (this.props.userDetails.loading) {
      return <View />
    }

    const { hasDisabledTutorial } = this.props.userDetails.UserDetails

    return (
      <Animatable.View style={[styles.answerEvaluator, {height: this.props.getAnswerEvaluatorHeight()}]} animation='slideInUp'>
        <LinearGradient
          style={styles.answerTopLine}
          colors={['#71b9d3', '#b3b3b3']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        />
        <LinearGradient
          style={styles.answerRightLine}
          colors={['#ff8533', '#b3b3b3']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
        />
        <LinearGradient
          style={styles.answerBottomLine}
          colors={['#c1272d', '#b3b3b3']}
          start={{x: 0, y: 1}}
          end={{x: 0, y: 0}}
        />
        <LinearGradient
          style={styles.answerLeftLine}
          colors={['#62c46c', '#b3b3b3']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        />
        <View style={styles.answerFieldTop}>
          <Text style={styles.answerText}>Easy</Text>
        </View>
        <View style={styles.answerFieldRight}>
          <Text style={[styles.answerText, { transform: [{ rotate: '90deg' }] }]}>Good</Text>
        </View>
        <View style={styles.answerFieldBottom}>
          <Text style={styles.answerText}>No clue</Text>
        </View>
        <View style={styles.answerFieldLeft}>
          <Text style={[styles.answerText, { transform: [{ rotate: '-90deg' }] }]}>Wrong</Text>
        </View>
        <View style={styles.answerCircle} />
        <SwipeBall evalItemId={this.props.evalItemId} />

        {!this.props.enabled && <View style={styles.answerEvaluatorOverlay} />}

        {this.props.enabled && !hasDisabledTutorial && this.state.showTutorial &&
          <View style={styles.answerEvaluatorOverlay}>
            <Text style={styles.infoText}>How would you describe experience answering this question?</Text>
            <Text style={styles.infoText}>
              Rate using one of the four answers.{'\n'}
              Just slide your finger from the center circle to correct button.
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text
                onPress={this.hideTutorial}
                style={[styles.button, { backgroundColor: '#62c46c' }]}
              >OK, go on</Text>
              <Text
                onPress={this.hideTutorialPermanently}
                style={[styles.button, { backgroundColor: '#662d91', marginLeft: 5 }]}
              >OK, go on. Don't show it again</Text>
            </View>
          </View>
        }
      </Animatable.View>
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

const userDetailsQuery = gql`
    query UserDetails {
        UserDetails {
            hasDisabledTutorial
            experience {
              level
            }
        }
    }
`

export default compose(
  connect(),
  withRouter,
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
LevelUpWrapper
)(AnswerEvaluator)
