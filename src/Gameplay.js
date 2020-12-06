import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Barbu from "./Barbu";
import barbuWS from './socketConfig';

// const username = prompt("What is your username");
const username = "Dog" + Math.floor(Math.random() * (101));
// const username = "Dog2";

class Gameplay extends Component {

    constructor(props){
        super(props);

        this.state = {
            ws: null,
            flipped : 'false',

            // modalIsOpen: false,
        };

        barbuWS.connect();

        this.barbuser = {
            name : username,
            id : "",
            nbVictory : 0
        };
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
            localStorage.setItem('name', username);
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

    getNbVictory = () => {
        console.log('00 - GAMEPLAY --- getNbVictory()');

        if(this.verifyLocalPlayer()) {

            // let data = localStorage.getItem('nb');
            // data = JSON.parse(data);
            // return data.nbVictory;
            return JSON.parse(localStorage.getItem('nb'));
        }
        else return 0;
    }

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
        
            barbuWS.emit("username",    [username, this.getNbVictory()] );

            this.setState({ws: barbuWS});
            this.barbuser.id = barbuWS.id;
            this.barbuser.nbVictory = this.getNbVictory();

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
            console.log('00 - GAMEPLAY - Disconnect() | barbuzer : ', username);
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