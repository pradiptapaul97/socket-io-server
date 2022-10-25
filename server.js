const express = require('express');
const socketIO = require('socket.io');
const http = require("http");
const app = express();
require('dotenv').config();
const server = http.createServer(app);
server.listen(process.env.PORT || 3000);
//for accept client origin else cors error
const io = socketIO(server,{
    cors:{
        // origin:["http://localhost:8080"]
        origin:"*"
    }
});

//soket io connection
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('send-messege',(messege,room)=>{
        console.log(messege);
        //create receive-messege event
        //io.emit('receive-messege',messege);  //for all user include the sender
        //socket.broadcast.emit('receive-messege',messege); // all user except sender 
        if(room)
        {
            socket.to(room).emit('receive-messege',messege);
        }
        else
        {
            socket.broadcast.emit('receive-messege',messege);
        }
    })
    socket.on('join-room',(room,cb)=>{
        console.log(room);
        if(room)
        {
            socket.join(room);
            cb(`Joined ${room}`)
        }
    })
  });
  

app.get('/',(req,res)=>{
    res.send(`Socket connected`);
})

console.log(`app is running on http://localhost:3000`);
