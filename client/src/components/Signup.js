import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router'

class Signup extends React.Component {
    submit = (e) => {
        e.preventDefault();
      this.props.submit({username: this.refs.username.value, password: this.refs.password.value})
          .then(() => {
              this.props.history.push("/");
          });
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
                    <input type="submit" value="Signup"/>
                </div>
            </form>)
    };
}

const signup = gql`
    mutation setUsernameAndPasswordForGuest($username: String!, $password: String!){
        setUsernameAndPasswordForGuest(username: $username, password: $password) {
            username
        }
    }
`;

export default withRouter(graphql(signup, {
    props: ({ownProps, mutate}) => ({
        submit: ({username, password}) => mutate({
            variables: {
                username,
                password
            }
        })
    })
})(Signup));
