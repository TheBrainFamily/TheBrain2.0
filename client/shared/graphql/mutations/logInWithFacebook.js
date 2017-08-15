import gql from 'graphql-tag'

export default gql`
    mutation logInWithFacebook($accessToken: String!, $userId: String!){
        logInWithFacebook(accessToken:$accessToken, userId:$userId) {
            _id, username, activated, email, facebookId
        }
    }
`