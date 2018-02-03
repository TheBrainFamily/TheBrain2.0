import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import sessionCountQuery from 'thebrain-shared/graphql/items/sessionCount'
const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const questionsWrapper = compose(
  connect(mapStateToProps),
  graphql(sessionCountQuery, {
    name: 'sessionCount',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)
