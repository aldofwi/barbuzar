import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { useState } from "react";

import Barbu from "./Barbu";
// import Modal from 'react-modal';

import SocketIO from 'socket.io-client';

// import Chat from "./Chat";
// import ScoreSheet from "./Score/ScoreSheet";
// import { Route, Link, Router } from 'react-router-dom';

/*
    "babel-cli": "^6.26.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-stage-2": "^6.24.1",

 */


const username = prompt("What is your username");
// const username = "Player" + Math.floor(Math.random() * (100));

const port = 3010;

// const [modalIsOpen, setModalIsOpen] = useState(false);

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
        let barbuWS = SocketIO("http://localhost:"+port, {
            transports: ["websocket"]
        });

        // let that = this; // Cache the This
        // let connectInterval;

        // WEBSOCKET ON CONNECT EVENT LISTENER
        barbuWS.on("connect", () => {

            barbuWS.emit("username",    username);
            barbuWS.emit("send", "NU CHALLENGER : " + username);

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

    };

    /**
     * Utilited by the @function connect to check
     * if connection is close, if so attempts to reconnect.
     * @returns {*}
     */
    check = () => {

        const { ws } = this.state ;
        console.log('O1 - GAMEPLAY - render() -  readyState : ', ws.readyState);

    };

    render() {

        return (

        <div>

            <Barbu
                cardSize={Math.min(window.innerHeight / 5.5, window.innerWidth / 5.5, 70)}
                style={{'height':window.innerHeight-47+'px'}} // FULL PAGE -54
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