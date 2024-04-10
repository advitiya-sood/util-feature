import React, { useState } from 'react';
import Chatbot from './Components/Chatbot';
import ChatMessage from './Components/ChatMessage';


function App() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pdfUrls, setPdfUrls] = useState([

  ]);

  const handleLogin = () => {
    // Check if the entered password is correct
    if (password === 'milestone-2') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
  };

  return (
    <div>
      <Chatbot setPdfUrls={setPdfUrls} />
      <ChatMessage pdfUrls={pdfUrls} setPdfUrls={setPdfUrls} />
    </div>
  );
}

export default App;
