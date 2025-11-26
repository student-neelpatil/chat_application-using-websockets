import { WebSocketServer, WebSocket } from 'ws';



//creating websocket server

function startserver() {

    const wss = new WebSocketServer({ port: 8080 });

    let usercount = 0;

    interface User {
       socket:WebSocket;
       room:string;
    }

    let allsockets: User[] = [];

    wss.on("connection", (socket) => {

        //pushing every socket to this array so when we send message it broadcast to evey user
        
        
        console.log("user connected", usercount);

        //sending the message from client
        socket.on("message", (message) => {
        
            
            //message is not object it is string so string is converted to object
            //@ts-ignore
            const parsedmessage =JSON.parse(message);

            if(parsedmessage.type==='join'){
                allsockets.push({
                    socket,
                    room:parsedmessage.payload.roomId
                })
            }
            //
            // {
            //     "type":"join",
            //      payload:{
            //         "roomId":"123"
            //     }
            // }


            if(parsedmessage.type==="chat"){
               
                let currentuserroom:any=null;
               //finding currentusers room 
                for(const val of allsockets){
                    if(val.socket==socket){
                      currentuserroom=val.room;
                    }
                }
               
                //if currentroom matches send the message in that room
                for (const val of allsockets ){
                    if(val.room == currentuserroom){
                        val.socket.send(parsedmessage.payload.message)
                    }
                }
            }

            

        

            

        })
    })

}



startserver()