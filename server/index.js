const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const cors = require('cors');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);

const io = socketio(server);

//Star the socket.io connection
io.on('connection', (socket) => {
    console.log('We have a new connection.');

    socket.on('join', ({name,room}, callback) => {
        const { error,user } = addUser({id: socket.id, name,room});
        
        if(error) return callback(error);

        socket.emit('message', {user: 'admin', text: `Welcome to ${user.room}, ${user.name}!`}); //Greet user to the chat
        socket.broadcast.to(user.room).emit('message', {user:'admin', text: `${user.name} has joined!`}); //Broadcast greeting to everyone else
        socket.join(user.room);

        io.to(user.room).emit('roomData', {room:user.room, users: getUsersInRoom(user.room)});
        callback();
    })

    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id); //Get user sending message
        io.to(user.room).emit('message', { user: user.name, text: message});
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id); //This user disconnected/left

        if(user) io.to(user.room).emit('message', {user:'admin', text:`${user.name} has left the chat.`});
    })
})
app.use(router);
app.use(cors);
server.listen(PORT);