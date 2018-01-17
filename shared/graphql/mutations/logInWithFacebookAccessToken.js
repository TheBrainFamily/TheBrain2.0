import gql from 'graphql-tag'

export default gql`
    mutation logInWithFacebookAccessToken($accessTokenFb: String!){
        logInWithFacebookAccessToken(accessTokenFb:$accessTokenFb) {
            _id, username, activated, email, facebookId, currentAccessToken
        }
    }
`
