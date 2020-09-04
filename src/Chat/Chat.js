import "bootstrap/dist/css/bootstrap.css";

import moment from "moment";
import React from 'react';
import ReactDOM from 'react-dom';

import { useEffect, useState } from "react";
import SocketIO from "socket.io-client";

const Chat = props => {

    // const socket = props.websocket;

    const socket = SocketIO("http://localhost:"+props.port, { transports: ["websocket"] }); // , "polling"

    // const username = props.barbuser;

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        //socket.on("connect", () => { socket.emit("username", username); });

        socket.on("users", users => { console.log("Userz ConnecteD ", users); setUsers(users); });

        socket.on("messagetxt", message => { setMessages( messages => [...messages, message]) });

        socket.on("connected", user => {
            console.log("UseR ConnecteD ", user.id);
            setUsers(users => [...users, user]);
            socket.emit("sendtxt", ["--- USER IN ---", user]);
        });

        socket.on("disconnected", id => {
            setUsers(users => { return users.filter(user => user.id !== id); });
            socket.emit("sendtxt", ["--- USER OUT ---", id]);
        });

    }, []);

    const submit = event => {
        event.preventDefault();
        console.log("USERS : ", users);
        socket.emit("sendtxt", [message, props.barbuser]);
        setMessage("");
    };

    //console.log('MESSAGES : ', messages);

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

/*

            <div className="row">
                <div className="col-md-12 mt-4 mb-4">

                    <h6>Hello {username}</h6>

                </div>
            </div>

 <div className="col-md-4">

                    <h6> Users </h6>

                    <ul id="users">

                        { users.map(({ name, id }) => ( <li key={id}> {name} </li> )) }

                    </ul>

                </div>
 */