const port = 3010 ;
const barbuUsers = {};

// Initialisation du Server.
const barbuServer = require("http").createServer();

// Import & Construction du socket.
const bio = require('socket.io')(barbuServer, {
    transports: ["websocket"]
});

bio.on("connection", client => {

    // console.log('| Server.js ---> Connection ', client);
    // There one can start emitting events to the client.

    client.on("username", username => {

        const user = {
            name: username,
            id: client.id,
        };
        barbuUsers[client.id] = user ;

        bio.emit("CONNECTED : ", user);
        bio.emit("users", Object.values(barbuUsers));

        console.log('Server.js --- Client Connecté : ', username);
        // console.log('Server.js --- Client : ', client);
        console.log('Server.js | barbuUsers =\n', barbuUsers);
    });

    client.on("send", message => {
        bio.emit("message", {
            text: message,
            date: new Date().toISOString(),
            user: barbuUsers[client.id],
        });
        console.log('Server.js --- Received Data : ', message);
    });

    client.on("sendtxt", message => {
        bio.emit("messagetxt", {
            text: message[0],
            date: new Date().toISOString(),
            user: message[1],
        });
        console.log('Server.js --- Received Msg : ', message, ' from ', message[1]);
    });

    client.on("click", value => {
        bio.emit("user", value.name);
        bio.emit("onclick", value);
        console.log('Server.js --- Click from ', value.name, ' on ', value.key);
    });

    client.on("deck", value => {
        bio.emit("newdeck", value);
        console.log('Server.js --- New Deck shuffle : ', value);
    });

    client.on("error", err => {
        bio.emit("onerror", err);
        console.log('Server.js ---> Error :', err);
    });

    client.on("disconnect", () => {
        // const username = barbuUsers[client.id] ;
        delete barbuUsers[client.id] ;
        bio.emit("DISCONNECTED : ", client.id);
        console.log('Server.js --- Client Déconnecté !', client.id);
    });

});

barbuServer.listen(port, () => { console.log('| server.js ---> Server started & Listening on port', port); });

