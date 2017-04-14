/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {ApolloClient, ApolloProvider, createNetworkInterface} from 'react-apollo';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {NativeRouter, Route, Link} from 'react-router-native'

// import Home from './components/Home';
import WellDone from './components/WellDone';
import Lecture from './components/Lecture';
import Questions from './components/Questions';
// import Footer from './components/Footer';
// import Login from './components/Login';
// import Signup from './components/Signup';



const networkInterface = createNetworkInterface({
    uri: 'http://localhost:8080/graphql',
// This needs to be changed to new.thebrain.pro if running from a real phone
//    uri: 'http://new.thebrain.pro:8080/graphql',

    opts: {
        credentials: 'include',
    },
});

const client = new ApolloClient({
    networkInterface,
});

export default class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>

                <NativeRouter>
                    <View style={{marginTop: 30}}>
                        <View>
                            <Route exact path="/" component={Lecture}/>
                            <Route exact path="/wellDone" component={WellDone}/>
                            <Route exact path="/questions" component={Questions}/>

                        </View>
                    </View>
                </NativeRouter>
            </ApolloProvider>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        padding: 10,
    },
    header: {
        fontSize: 20,
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    subNavItem: {
        padding: 5,
    },
    topic: {
        textAlign: 'center',
        fontSize: 15,
    }
})

{/*<Route exact key="lecture" path="/lecture" component={Lecture}/>*/
}

AppRegistry.registerComponent('mobileClient', () => App);
