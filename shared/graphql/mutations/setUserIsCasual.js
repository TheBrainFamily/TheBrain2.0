import gql from 'graphql-tag'

export default gql`
  mutation setUserIsCasual($isCasual: Boolean!) {
    setUserIsCasual(isCasual:$isCasual) {
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
