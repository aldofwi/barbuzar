import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Barbu from "./Barbu";
import barbuWS from './socketConfig';

// const username = prompt("What is your username");
const name = "Dog" + Math.floor(Math.random() * (10001));

class Gameplay extends Component {

    constructor(props){
        super(props);

        this.state = {
            ws: null,
            username: name
        };

        this.barbuser = {
            name : '',
            id : '',
            nbVictory : 0
        };

        this.nameSubmit = false;
    }

    componentDidMount() {
        console.log('00 - GAMEPLAY - componentDidMount()');

        this.setLocalPlayer();  
        this.connect();
    }

    timeout = 250; // Initial timeout duration

    setLocalPlayer() {
        console.log('00 - GAMEPLAY - setLocalPlayer() --- exists ? ', this.verifyLocalPlayer());

        if(!this.verifyLocalPlayer()) {
            // Record NEW Player in Local Storage.
            localStorage.setItem('name', name);
            localStorage.setItem('nb', 0);
            console.log('00 - GAMEPLAY - setLocalPlayer() --> JUST RECORDED ! ');
        }
        else console.log('00 - GAMEPLAY - setLocalPlayer() <<< ALREADY THERE !');
    }

    verifyLocalPlayer() {
        console.log('00 - GAMEPLAY - verifyLocalPlayer() ::: NAME ::: ', localStorage.getItem('name'));

        if('name' in localStorage) return true;
        else return false;
    }

    getName = () => {
        console.log('00 - GAMEPLAY -localStorage- getName()');

        if(this.verifyLocalPlayer()) return localStorage.getItem('name');
        else return name;
    }

    getNbVictory = () => {
        console.log('00 - GAMEPLAY -localStorage- getNbVictory()');

        if(this.verifyLocalPlayer()) return JSON.parse(localStorage.getItem('nb'));
        else return 0;
    }

    /**
     * @function connect
     * This function establishes the connect with the websocket
     * and also ensures constant reconnection if connection loss.
     */
    connect = () => {

        // WEBSOCKET ON CONNECT EVENT LISTENER
        barbuWS.on('connect', () => {
        
            // barbuWS.emit("username",    [this.state.username, this.getNbVictory()] );

            this.setState({ws: barbuWS});
            this.barbuser.name = this.getName();
            this.barbuser.nbVictory = this.getNbVictory();
            this.barbuser.id = barbuWS.id;
            
            console.log('00 - GAMEPLAY - connect() | barbuser : ', this.barbuser);
        });

        // WEBSOCKET ON MESSAGE EVENT LISTENER
        barbuWS.on("send", message => {

            barbuWS.emit("message", message);
            console.log('00 - GAMEPLAY - send() | barbuWS msg : ', message);
        });

        // WEBSOCKET ON CLICK EVENT LISTENER
        barbuWS.on("click", value => {
            barbuWS.emit("onclick", value);

            console.log('00 - GAMEPLAY - click() | name : ', this.props.websocket.username);
            console.log('00 - GAMEPLAY - click() | barbuWS.ID : ', barbuWS.id);
            console.log('00 - GAMEPLAY - click() | value : ', value);
        });

        // WEBSOCKET ON DISCONNECT EVENT LISTENER
        barbuWS.on("disconnect", reason => {

            if ( reason !== 'transport close ') { barbuWS.connect(); }
            console.log('00 - GAMEPLAY - Disconnect() | barbuzer : ', name);
        });

    };

    /**
     * Utilited by the @function connect to check
     * if connection is close, if so attempts to reconnect.
     * @returns {*}
     */
    check = () => {

        const { ws } = this.state ;
        console.log('00 - GAMEPLAY - check() - readyState : ', ws.readyState);
    };

    handleChange = event => {
        console.log('00 - GAMEPLAY - handleChange() - event name : ', event.target.value);
        // event.preventDefault();
        this.setState({username: event.target.value});
    };

    handleSubmit = event => {
        console.log('00 - GAMEPLAY - handleSubmit() - username : ', this.state.username);

        event.preventDefault(); // STOP RELOADING PAGE.
        localStorage.setItem('name', this.state.username);

        this.barbuser.name = this.state.username;
        this.nameSubmit = true;

        console.log('this.nameSubmit : ', this.nameSubmit);
        barbuWS.emit("username",    [this.state.username, this.getNbVictory()] );

        this.setState(this.state);
    };

    render() {

        return (
            <div>
            {
                !this.nameSubmit
                    ?
                <div className="welcome">
                    <form className="form-inline" onSubmit={this.handleSubmit}>
                        <div className="nameform">
                            
                            <input type="text" className="form-control" placeholder="Username" onChange={this.handleChange} id="nameValue" required />
                            <button type="submit" className="btn btn-danger">Play</button>
                            
                        </div>
                    </form>
                </div>    
                    :
                <div>

                    <Barbu
                        cardSize={Math.min(window.innerHeight / 5.5, window.innerWidth / 5.5, 70)}
                        style={{'height':window.innerHeight-62+'px'}} // FULL PAGE -54
                        barbuser={this.barbuser}
                        websocket={this.state.ws}
                    />

                </div>

            }
            </div> 
        )
    }
}

// ========================================

ReactDOM.render(<Gameplay />, document.getElementById("root"));

// ========================================

export default Gameplay;

//    "start": "npm run start:server & react-scripts start",
//    "start:server": "node src/server.js",

// "start": "react-scripts start",

// "homepage": "http://aldofwi.github.io/barbuzar",