import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { getGraphqlForCurrentLessonOptionalCourse } from 'thebrain-shared/graphql/lessons/currentLesson'

const reviewsQuery = gql`
    query Reviews {
        Reviews {
            ts, count
        }
    }
`
const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export const reviewsCalendarWrapper = compose(
  connect(mapStateToProps),
  getGraphqlForCurrentLessonOptionalCourse(graphql),
  graphql(reviewsQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })
)
