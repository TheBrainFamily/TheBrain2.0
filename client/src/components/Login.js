import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router'
import update from 'immutability-helper';
import { push } from 'react-router-redux'

import store from '../store'

class Login extends React.Component {
    submit = (e) => {
        e.preventDefault();
        this.props.submit({username: this.refs.username.value, password: this.refs.password.value}).then(() => {
            store.dispatch(push("/"));
        })
    };
    render() {
        return (
            <form onSubmit={this.submit}>
                <div>
                    <label>Username:</label>
                    <input ref="username" type="text" name="username"/>
                </div>
                <div>
                    <label>Password:</label>
                    <input ref="password" type="password" name="password"/>
                </div>
                <div>
                    <input type="submit" value="Log In"/>
                </div>
            </form>)
    }
}
const logIn = gql`
    mutation logIn($username: String!, $password: String!){
        logIn(username: $username, password: $password) {
            _id, username, activated
        }
    }
`;

export default withRouter(graphql(logIn, {
    props: ({ownProps, mutate}) => ({
        submit: ({username, password}) => mutate({
            variables: {
                username,
                password
            },
            updateQueries: {
                CurrentUser: (prev, {mutationResult}) => {
                    console.log("Gozdecki: mutationResult",mutationResult);
                    console.log("Gozdecki: prev",prev);
                    return update(prev, {
                        CurrentUser: {
                            $set: mutationResult.data.logIn
                        }
                    });
                }
            }
        })
    })
})(Login));
