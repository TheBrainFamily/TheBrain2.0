import React, { Component } from 'react';
import logo from './logo_thebrain.jpg';
import './App.css';
import Home from './components/Home';
import WellDone from './components/WellDone';
import Tutorial from './components/Tutorial';
import Questions from './components/Questions';
import Footer from './components/Footer';
import Login from './components/Login';

import { BrowserRouter, Route } from 'react-router-dom';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:8080/graphql',
    opts: {
        credentials: 'include',
    },
});

const client = new ApolloClient({
    networkInterface,
});

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <ApolloProvider client={client}>

                    <div className="App">
                        <div className="App-header">
                            <img src={logo} className="App-logo" alt="logo"/>
                            <h2 className="make-it-bigger">Welcome to TheBrain.Pro</h2>
                        </div>

                        <div className="App-intro styleIntroduction">
                            <Route exact key="tutorial" path="/" component={Home}/>
                            <Route exact key="Tutorial" path="/lecture"
                                   component={Tutorial}/>

                            <Route exact key="wellDone" path="/wellDone"
                                   component={WellDone}/>


                            <Route exact key="questions" path="/questions"
                                   component={Questions}/>
                            <Route exact key="login" path="/login" component={Login}/>
                            <Footer/>
                        </div>

                    </div>
                </ApolloProvider>
            </BrowserRouter>
        );
    }
}

export default App;
