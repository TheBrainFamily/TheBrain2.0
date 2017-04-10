import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import logo from './../logo_thebrain.jpg';
import currentUserQuery from '../queries/currentUser';
import { Link } from 'react-router-dom';

class LoginSwitcher extends React.Component {
    logout = (e) => {
        e.preventDefault();
        this.props.logout();
    }
    render() {
        if (this.props.activated) {
            return <Link to="/logout" onClick={this.logout}>Logout</Link>

        }
        return <Link to="/login">Login</Link>;
    }
};

const logOutQuery = gql`
    mutation logOut {
        logOut {
            _id
        }  
    }
`;

const LoginSwitcherWithGraphQl = graphql(logOutQuery, {
    props: ({ownProps, mutate}) => ({
        logout: () => mutate({
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
})(LoginSwitcher);

const AppHeader = (props) => {
    const currentUser = props.data.CurrentUser;

    return (
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2 className="make-it-bigger">Welcome to TheBrain.Pro</h2>
            {!props.data.loading && <LoginSwitcherWithGraphQl activated={currentUser && currentUser.activated}/>}
        </div>
    );
};


export default graphql(currentUserQuery)(AppHeader);