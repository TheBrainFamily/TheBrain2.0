import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tutorial from './components/Tutorial';
import WellDone from './components/WellDone';
import Questions from './components/Questions';
import { Match, BrowserRouter } from 'react-router';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient();

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <ApolloProvider client={client}>
                    <div className="App">
                        <div className="App-header">
                            <img src={logo} className="App-logo" alt="logo"/>
                            <h2>Welcome to TheBrain.Pro</h2>
                        </div>
                        <div className="App-intro">
                            <Match exactly pattern="/" component={Tutorial}/>
                            <Match exactly pattern="/wellDone" component={WellDone}/>
                            <Match exactly pattern="/questions" component={Questions}/>

                        </div>
                    </div>
                </ApolloProvider>
            </BrowserRouter>
        );
    }
}

export default App;
