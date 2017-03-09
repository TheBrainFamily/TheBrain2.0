import React, {Component} from 'react';
import logo from '../../logo_thebrain.jpg';
import './App.css';
import Introduction from '../introduction/Introduction.jsx';
import Content from '../content/Content.jsx'
import Footer from '../footer/Footer.jsx'

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2 className="make-it-bigger">Welcome to TheBrain.Pro</h2>
                </div>
                <p className="App-intro">
                    <Introduction/>
                    <Content/>
                    <Footer/>
                </p>
            </div>
        )
    }
}

export default App;
