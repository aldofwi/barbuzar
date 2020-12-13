
const barbuUsers = {};

const port = process.env.PORT || 5000 ; // process.env.PORT || 3000 

// Start the web server Express.
const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const app = express();

// Initialisation du Server via Express.
const barbuServer = http.createServer(app);

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
);

// Construction de la socket via mon Server.
const bio = require('socket.io')(barbuServer);

bio.on("connect", (socket) => {

    // There one can start emitting events to the client.
    console.log('::: New User Connected to Server :::');

    socket.on("username", all => {

        const user = {
            name: all[0],
            id: socket.id,
            nbVictory: all[1]
        };
        barbuUsers[socket.id] = user ;

        bio.emit("connected", user); // FOR THE CHAT
        bio.emit("users", Object.values(barbuUsers));

        console.log('Server.js --- Client Connecté : ', all[0]);
        console.log('Server.js --- NB Victoires : ', all[1]);
        console.log('Server.js || barbuUsers ||\n', barbuUsers);
    });

    socket.on("send", message => {
        socket.emit("message", {
            text: message[0],
            date: new Date().toISOString(),
            user: barbuUsers[socket.id],
        });
        console.log('Server.js --- Received DATA : ', message[0]);
    });

    socket.on("sendtxt", message => {
        bio.emit("messagetxt", {
            text: message[0],
            date: new Date().toISOString(),
            user: message[1],
        });
        console.log('Server.js --- Received Msg : ', message[0], ' from ', message[1]);
    });

    socket.on("click", value => {
        // bio.emit("user", value.name);
        bio.emit("onclick", value);
        console.log('Server.js --- Click from ', value.name, ' on ', value.key);
    });

    socket.on("deck", value => {
        bio.emit("newdeck", value);
        console.log('Server.js --- New Deck shuffle : ', value);
    });

    socket.on("info", value => {
        bio.emit("newinfo", value);
        console.log('Server.js --- New Info from Players : ', value);
    });

    socket.on("error", err => {
        socket.emit("onerror", err);
        console.log('Server.js ---> Error :', err);
    });

    socket.on("disconnect", reason => {

        if( barbuUsers[socket.id] !== undefined ){

            console.log("Server.js --- Disconnected Client : ", barbuUsers[socket.id.toString()].name, " because ", reason, ".");
            bio.emit("disconnected", [socket.id, barbuUsers[socket.id.toString()].name]);
            delete barbuUsers[socket.id];
        }

        // if ( reason !== 'transport close ') { socket.connect(); } // not a function
    });

});

barbuServer.listen(port, () => { console.log('| Server.js ---> Server started & Listening on port', port); });


