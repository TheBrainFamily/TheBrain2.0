import React from 'react';
import {graphql} from 'react-apollo';
import logo from './../logo_thebrain.jpg';
import currentUserQuery from '../queries/currentUser';
import { Link } from 'react-router-dom';

const LoginSwitcher = (props) => {
    if (props.activated) {
        return <Link to="/logout">Logout</Link>

    }
    return <Link to="/login">Login</Link>;
};

const AppHeader = (props) => {
    const currentUser = props.data.CurrentUser;

    return (
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2 className="make-it-bigger">Welcome to TheBrain.Pro</h2>
            {!props.data.loading && <LoginSwitcher activated={currentUser && currentUser.activated}/>}
        </div>
    );
};


export default graphql(currentUserQuery)(AppHeader);