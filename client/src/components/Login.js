import React from 'react';
import { withRouter } from 'react-router'

class Login extends React.Component {
    render() {
        return (
            <form action="http://localhost:8080/login" method="get">
                <div>
                    <label>Username:</label>
                    <input type="text" name="username"/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                </div>
                <div>
                    <input type="submit" value="Log In"/>
                </div>
            </form>)
    }
}

export default withRouter(Login);