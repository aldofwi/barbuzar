
import socketBB from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000'

const barbuWS = socketBB(ENDPOINT);

export default barbuWS;



// import socketBB from 'socket.io-client';

// const barbuWS = socketBB("http://localhost:3000", { transports: ["websocket"] });

// const barbuWS = socketBB("https://aldofwi.github.io/barbuzar");

// export default barbuWS;