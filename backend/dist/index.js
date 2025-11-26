import { WebSocketServer, WebSocket } from 'ws';
//creating websocket server
function startserver() {
    const wss = new WebSocketServer({ port: 8080 });
    let usercount = 0;
    let allsockets = [];
    wss.on("connection", (socket) => {
        //pushing every socket to this array so when we send message it broadcast to evey user
        allsockets.push(socket);
        usercount = usercount + 1;
        console.log("user connected", usercount);
        //sending the message from client
        socket.on("message", (message) => {
            console.log(message.toString());
            //send message from server and broadcasting to all clients
            //   for(let i=0;i<allsockets.length;i++)
            //   {
            //     const s =allsockets[i];//here we get all sockets one by one
            //     s.send(message.toString()+"sent from the server");
            //   }
            //send message from server and broadcasting to all clients
            for (const s of allsockets) {
                s.send(message.toString() + " sent from server");
            }
            socket.on("close", () => {
                allsockets = allsockets.filter((x) => x != socket);
            });
        });
    });
}
startserver();
//# sourceMappingURL=index.js.map