const port = 3000 ;
const barbuUsers = {};

// Initialisation du Server.
const barbuServer = require("http").createServer();

// Import & Construction du socket.
const bio = require('socket.io')(barbuServer, {
    transports: ["websocket"]
});

bio.on("connection", function(socket) {

    // There one can start emitting events to the client.

    socket.on("username", username => {

        const user = {
            name: username,
            id: socket.id,
        };
        barbuUsers[socket.id] = user ;

        bio.emit("connected", user);
        bio.emit("users", Object.values(barbuUsers));

        console.log('Server.js --- Client Connecté : ', username);
        console.log('Server.js | barbuUsers =\n', barbuUsers);
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
        bio.emit("user", value.name);
        bio.emit("onclick", value);
        console.log('Server.js --- Click from ', value.name, ' on ', value.key);
    });

    socket.on("deck", value => {
        bio.emit("newdeck", value);
        console.log('Server.js --- New Deck shuffle : ', value);
    });

    socket.on("error", err => {
        socket.emit("onerror", err);
        console.log('Server.js ---> Error :', err);
    });

    socket.on("port", nb => {
        // const port = nb ; // Delete first line on TOP.
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