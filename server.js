const path = require("path")
const http = require("http")
const express = require("express")
const app = express();
const socketio = require("socket.io");
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);

const {userJoin,findUser,userLeave,getRoomUsers} = require("./utils/user");

const formatMessage = require("./utils/messages")

io = socketio(server);

//serving static files 
app.use(express.static(path.join(__dirname,'Public')));
 

const botname = "Chad"
//Run when client connects
io.on('connection', (socket) => {

    socket.on("joinedRoom",({username,room})=>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);
        //welcome current user
        socket.emit("message",formatMessage(botname,"welcome to chat boy"));

        socket.broadcast.to(user.room).emit("message",formatMessage(botname,`${user.username} just joined the chat`));
        
        //sends users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    
    })
    

   
    
    //listening chat message
    socket.on('chatMessage',(message)=>{
        const user = findUser(socket.id);

        io.to(user.room).emit("message",formatMessage(user.username,message))
    })

    socket.on("disconnect",()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message",formatMessage(botname,`${user.username} left the chatroom`));
            //sends users and room info
            io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
        }
       
    })

});

server.listen(PORT,()=>{
    console.log(`Server started on PORT : ${PORT}`)
});