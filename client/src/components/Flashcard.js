import React from 'react';

export default class extends React.Component {
    render() {
        return <div>
            <div className="question">How many countries are on the earth?</div>
            <div className="answer">
                <br/>
                <br/>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
            </div>
        </div>
    }
}