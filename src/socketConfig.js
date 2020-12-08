
import socketBB from 'socket.io-client';

let ENDPOINT = 'http://localhost:3000';

    if( process.env.NODE_ENV !== 'development' ) ENDPOINT = '' ;

const barbuWS = socketBB(ENDPOINT);

barbuWS.connect();

export default barbuWS; 



// barbuWS.connect();

// import socketBB from 'socket.io-client';

// const barbuWS = socketBB("http://localhost:3000", { transports: ["websocket"] });

// const barbuWS = socketBB("https://aldofwi.github.io/barbuzar");

// export default barbuWS;