const express = require('express');
const app = express();
require('dotenv').config();
const http = require("http").createServer(app);
//for accept client origin else cors error
const socketIO = require('socket.io')(http,{
    cors:{
        // origin:["http://localhost:8080"]
        origin:"*"
    }
});

http.listen(process.env.PORT || 4000,()=>{
    //soket io connection
    socketIO.on('connection', (socket) => {
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
    console.log(`app is running on http://localhost:4000`);
});


  

app.get('/',(req,res)=>{
    res.send(`Socket connected`);
})


