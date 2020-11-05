import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Barbu from "./Barbu";
//import SocketIO from 'socket.io-client';
import barbuWS from './socketConfig';

// const username = prompt("What is your username");
const username = "Dog" + Math.floor(Math.random() * (101));

const port = 3000;

class Gameplay extends Component {

    constructor(props){
        super(props);

        this.state = {
            ws: null,
            flipped : 'false',

            // modalIsOpen: false,
        };

        this.barbuser = {
            name : username,
            id : "",
        };
    }

    componentDidMount() {
        console.log('O1 - GAMEPLAY - componentDidMount()');

        this.connect();
    }

    timeout = 250; // Initial timeout duration

    /**
     * @function connect
     * This function establishes the connect with the websocket
     * and also ensures constant reconnection if connection loss.
     */
    connect = () => {

        // WEBSOCKET DEFINITION
        // let barbuWS = SocketIO("http://localhost:"+port, { transports: ["websocket"] });

        // WEBSOCKET ON CONNECT EVENT LISTENER
        barbuWS.on("connect", () => {

            barbuWS.emit("username",    username);

            this.setState({ws: barbuWS});
            this.barbuser.id = barbuWS.id;

            console.log('O1 - GAMEPLAY - connect() | barbuser : ', this.barbuser);
        });

        // WEBSOCKET ON MESSAGE EVENT LISTENER
        barbuWS.on("send", message => {

            barbuWS.emit("message", message);
            console.log('O1 - GAMEPLAY - send() | barbuWS msg : ', message);
        });

        // WEBSOCKET ON CLICK EVENT LISTENER
        barbuWS.on("click", value => {
            barbuWS.emit("onclick", value);

            console.log('O1 - GAMEPLAY - click() | name : ', this.props.websocket.username);
            console.log('O1 - GAMEPLAY - click() | barbuWS.ID : ', barbuWS.id);
            console.log('O1 - GAMEPLAY - click() | value : ', value);
        });

        // WEBSOCKET ON DISCONNECT EVENT LISTENER
        barbuWS.on("disconnect", reason => {

            if ( reason !== 'transport close ') { barbuWS.connect(); }
            console.log('O1 - GAMEPLAY - Disconnect() | barbuzer : ', username);
        });

    };

    /**
     * Utilited by the @function connect to check
     * if connection is close, if so attempts to reconnect.
     * @returns {*}
     */
    check = () => {

        const { ws } = this.state ;
        console.log('O1 - GAMEPLAY - check() - readyState : ', ws.readyState);
    };

    render() {
        // console.log('O1 - GAMEPLAY - render() - SOCKET : ', this.state.ws);
        // <button className="btn btn-danger" type="submit">Play</button>

        return (

        <div>

                <Barbu
                    cardSize={Math.min(window.innerHeight / 5.5, window.innerWidth / 5.5, 70)}
                    style={{'height':window.innerHeight-62+'px'}} // FULL PAGE -54
                    barbuser={this.barbuser}
                    websocket={this.state.ws}
                    port={port}
                />

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