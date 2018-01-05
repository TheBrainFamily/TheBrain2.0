import gql from 'graphql-tag'

export default gql`
    mutation closeCourse {
        closeCourse {
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
