import gql from 'graphql-tag'

export default gql`
    mutation confirmLevelUp {
        confirmLevelUp {
            experience {
              showLevelUp
            }
        }
    }
`
