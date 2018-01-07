import gql from 'graphql-tag'

export default gql`
  mutation switchUserIsCasual {
    switchUserIsCasual {
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
