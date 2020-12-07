
import socketBB from 'socket.io-client';



const ENDPOINT = 'http://localhost:3000';

let barbuWS ;


    if( process.env.NODE_ENV === 'development' ) {

        barbuWS = socketBB(ENDPOINT);

    } else {

        barbuWS = socketBB();
    }




    
barbuWS.connect();



export default barbuWS; 



// barbuWS.connect();

// import socketBB from 'socket.io-client';

// const barbuWS = socketBB("http://localhost:3000", { transports: ["websocket"] });

// const barbuWS = socketBB("https://aldofwi.github.io/barbuzar");

// export default barbuWS;