const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');

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

        callback();
    })

    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id); //Get user sending message
        console.log(user.room);
        io.to(user.room).emit('message', { user: user.name, text: message});
        callback();
    })

    socket.on('disconnect', () => {
        console.log('User has left'); 
    })
})
app.use(router);

server.listen(PORT, () => console.log(`Server started successfully on ${PORT}`));