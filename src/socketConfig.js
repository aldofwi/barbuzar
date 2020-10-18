
import socketBB from 'socket.io-client';

const barbuWS = socketBB("http://localhost:3000", { transports: ["websocket"] });

export default barbuWS;