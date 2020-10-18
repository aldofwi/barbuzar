import "bootstrap/dist/css/bootstrap.css";

import moment from "moment";
import React from 'react';
import ReactDOM from 'react-dom';

import { useEffect, useState } from "react";
// import SocketIO from "socket.io-client";
import barbuWS from '../socketConfig';

const Chat = props => {

    //const socket = SocketIO("http://localhost:"+props.port, { transports: ["websocket"] }); // , "polling"

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        barbuWS.on("users", users => { console.log("CHAT --- Users ConnecteD : ", users); setUsers(users); });

        barbuWS.on("messagetxt", message => { setMessages( messages => [...messages, message]) });

        barbuWS.on("connected", user => {
            barbuWS.emit("sendtxt", ["--- USER IN ---", user.name]);
            setUsers(users => [...users, user]);
        });

        barbuWS.on("disconnected", data => {
            setUsers(users => { return users.filter(user => user.id !== data[0]); });
            // barbuWS.emit("sendtxt", ["--- USER OUT ---", data[1]]);
            console.log("CHAT --- Logged OUT = ", data[1]);
        });
        
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = event => {
        event.preventDefault();
        console.log("CHAT --- USERS : ", users);
        barbuWS.emit("sendtxt", [message, props.barbuser]);
        setMessage("");
    };

    return(

        <div className="container">

            <div className="row">

                <div>
                    <h5 className="messages"><strong> Messages </strong></h5>

                    <div className="msg">

                        {messages.slice(0).reverse().map(({ user, date, text }, index) => (

                            <div key={index} className="row small">

                                <div className="col-sm">

                                    {moment(date).format("h:mma")}

                                    <b className="col-"> [{[user]}] </b>

                                    <em className="col-"> {text} </em>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

            <div className="typetext">

                <form onSubmit={submit} id="form">
                    <div className="input-group">

                        <input
                            type="text"
                            className="col-sm"
                            aria-label="Default"
                            onChange={e => setMessage(e.currentTarget.value)}
                            placeholder="Type your text here."
                            value={message}
                            id="text"
                        />

                        <span className="input-group-btn">
                            <button id="submit" type="submit" className="btn btn-dark">

                                Send

                            </button>
                        </span>

                    </div>
                </form>

            </div>

        </div>

    );

};

// ========================================

ReactDOM.render(<Chat />, document.getElementById("root"));

// ========================================

export default Chat;