import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

let socket;
const Chat = ({location}) => {

    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const {name,room} = queryString.parse(location.search);
        setName(name);
        setRoom(room);
        socket = io(ENDPOINT);
        socket.emit('join',{name,room}, () => {

        });
        return () => { 
            socket.emit('disconnect'); //Leave chat
            socket.off()
        }
        
    },[ENDPOINT,location.search]);

    useEffect(() => {
        socket.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
    }, [messages]);

    //Function to send messages
    const sendMessage = (e) => {
        e.preventDefault(); //Stops refreshes
        if(message) socket.emit('sendMessage', message, () => setMessage(''));
    }
    return (
       <div className="outerContainer">
           <div className="container">
                <input 
                    value={message} 
                    onChange={(e)=> setMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null }
                    />
           </div>
       </div>
    )
}

export default Chat;