import gql from 'graphql-tag'

export default gql`
    mutation changePassword($oldPassword: String!, $newPassword: String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
          success
        }
    }
`
