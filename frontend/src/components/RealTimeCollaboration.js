import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

function RealTimeCollaboration() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = io();

  useEffect(() => {
    socket.on('collaborate', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    socket.emit('collaborate', input);
    setInput('');
  };

  return (
    <div>
      <h2>Real-Time Collaboration</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default RealTimeCollaboration;
