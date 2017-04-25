import React, { Component } from 'react'
import { Route } from 'react-router'
import { ConnectedRouter as Router } from 'react-router-redux'
import { ApolloProvider } from 'react-apollo'
import store, { client, history } from './store'
import './App.css'
import Home from './components/Home'
import WellDone from './components/WellDone'
import Lecture from './components/Lecture'
import Questions from './components/Questions'
import Footer from './components/Footer'
import Login from './components/Login'
import Signup from './components/Signup'
import Header from './components/Header'
import ResetPassword from './components/ResetPassword'

class App extends Component {
  render () {
    return (
      <ApolloProvider client={client} store={store}>
        <Router history={history}>
          <div className="App">
            <Header />
            <div className="App-intro styleIntroduction">
              <Route exact key="tutorial" path="/" component={Home}/>
              <Route exact key="Lecture" path="/lecture" component={Lecture}/>
              <Route exact key="wellDone" path="/wellDone" component={WellDone}/>
              <Route exact key="questions" path="/questions" component={Questions}/>
              <Route exact key="login" path="/login" component={Login}/>
              <Route exact key="signup" path="/signup" component={Signup}/>
              <Route exact key="resetpassword" path="/resetpassword" component={ResetPassword}/>
              <Footer />
            </div>
          </div>
        </Router>
      </ApolloProvider>
    )
  }
}
export default App
