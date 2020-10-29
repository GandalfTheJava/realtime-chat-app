import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css';

let socket;
const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const ENDPOINT = 'https://realtime-chattyy.herokuapp.com/';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room);
        socket = io(ENDPOINT);
        socket.emit('join', { name, room }, () => {

        });
        return () => {
            socket.emit('disconnect'); //Leave chat
            socket.off()
        }

    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });

        socket.on('roomData', ({ users }) => {
            setUsers(users)
        });

    }, []);

    //Function to send messages
    const sendMessage = (e) => {
        e.preventDefault(); //Stops refreshes
        if (message) socket.emit('sendMessage', message, () => setMessage(''));
    }
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat;