import gql from 'graphql-tag'

export default gql`
    mutation logInWithFacebook($accessTokenFb: String!, $userIdFb: String!){
        logInWithFacebook(accessTokenFb:$accessTokenFb, userIdFb:$userIdFb) {
            _id, username, activated, email, facebookId, currentAccessToken
        }
    }
`
