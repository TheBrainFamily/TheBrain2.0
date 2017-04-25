import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';

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
                         console.log(data);
                         this.setState({user: data.credentials});
                     }}
                     onLogout={() => {
                         console.log("Logged out.");
                         this.setState({user: null});
                     }}
                     onLoginFound={(data) => {
                         console.log("Existing login found.");
                         console.log(data);
                         this.setState({user: data.credentials});
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

export default Signup;
