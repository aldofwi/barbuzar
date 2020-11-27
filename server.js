const barbuUsers = {};

const port = 3000 ; // process.env.PORT || 3000 

var app = require('express')();

// Initialisation du Server via Express.
const barbuServer = require('http').Server(app);

// Import & Construction de la socket.
const bio = require('socket.io')(barbuServer);

// app.get("/", function(req, res){ res.sendFile(__dirname + '/index.html'); });

bio.on("connection", function(socket) {

    // There one can start emitting events to the client.
    console.log('... A new user just arrived ...');

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
        console.log('Server.js --- NB V Client : ', all[1]);
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

barbuServer.listen(port, () => { console.log('| server.js ---> Server started & Listening on port', port); });

// const barbuServer = require("http").createServer(function(req, res){
// console.log('::: Connected to Server :::'); });