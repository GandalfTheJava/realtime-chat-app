import React from 'react';
import './input.css';

const Input = ({ message, setMessage, sendMessage }) => {
    return (
        <form className='form'>
            <input
                className='input'
                type='text'
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
            />

            <button
                className='sendButton'
                onClick={(event) => sendMessage(event)}>
                Send
            </button>
        </form>
    )
}

export default Input;