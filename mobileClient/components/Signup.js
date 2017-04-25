import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import update from 'immutability-helper';
import gql from 'graphql-tag';
import {graphql, compose} from 'react-apollo';
import currentUserQuery from './../queries/currentUser';

class Signup extends React.Component {
    render = () => {
        return (<View><Text>In Signup</Text>
            <FBLogin style={{marginBottom: 10,}}
                     ref={(fbLogin) => {
                         this.fbLogin = fbLogin
                     }}
                     permissions={["email", "user_friends"]}
                     loginBehavior={FBLoginManager.LoginBehaviors.Native}
                     onLogin={(data) => {
                         console.log("Logged in!");
                         this.props.logInWithFacebook({accessToken: data.credentials.token});
                     }}
                     onLogout={() => {
                         console.log("Logged out.");
                         this.setState({user: null});
                     }}
                     onLoginFound={(data) => {
                         console.log("Existing login found.");
                         console.log(data);
                         this.props.logInWithFacebook({accessToken: data.credentials.token});
                     }}
                     onLoginNotFound={() => {
                         console.log("No user logged in.");
                         this.setState({user: null});
                     }}
                     onError={(data) => {
                         console.log("ERROR");
                         console.log(data);
                     }}
                     onCancel={() => {
                         console.log("User cancelled.");
                     }}
                     onPermissionsMissing={(data) => {
                         console.log("Check permissions!");
                         console.log(data);
                     }}
            />
        </View>);
    };

}

const logInWithFacebook = gql`
    mutation logInWithFacebook($accessToken: String!){
        logInWithFacebook(accessToken:$accessToken) {
            _id, username, activated
        }
    }
`;

export default compose(
    graphql(currentUserQuery, {name: "currentUser"}),
    graphql(logInWithFacebook, {
        props: ({ownProps, mutate}) => ({
            logInWithFacebook: ({accessToken}) => mutate({
                variables: {
                    accessToken
                },
                updateQueries: {
                    CurrentUser: (prev, {mutationResult}) => {
                        console.log("Gozdecki: mutationResult", mutationResult);
                        console.log("Gozdecki: prev", prev);
                        return update(prev, {
                            CurrentUser: {
                                $set: mutationResult.data.logInWithFacebook
                            }
                        });
                    }
                }
            })
        })
    })
)(Signup);
