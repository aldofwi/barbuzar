
import socketBB from 'socket.io-client';

// const barbuWS = socketBB("http://localhost:3000", { transports: ["websocket"] });

const barbuWS = socketBB("https://aldofwi.github.io/barbuzar", { transports: ["websocket"] });

export default barbuWS;