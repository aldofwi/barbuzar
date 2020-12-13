


import socketBB from 'socket.io-client';





let ENDPOINT = 'http://localhost:5000';


if(process.env.NODE_ENV !== 'development') ENDPOINT = '/';


console.log('00 - socketConfig --- Process.env.NODE_ENV = ', process.env.NODE_ENV);


const barbuWS = socketBB(ENDPOINT);





export default barbuWS;
