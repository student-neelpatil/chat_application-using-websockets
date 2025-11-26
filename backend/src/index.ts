import { WebSocketServer } from 'ws';

//creating websocket server

function startserver(){

    const wss= new WebSocketServer({port:8080});

    let usercount=0;

    wss.on("connection",(socket)=>{
       usercount=usercount+1;
       console.log("user connected",usercount);
    })
}



startserver();