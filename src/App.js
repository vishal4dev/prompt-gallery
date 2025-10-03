import React, { useState, useEffect } from 'react';
import PromptGallery from './components/PromptGallery';
import AuthPage from './components/AuthPage';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSetToken = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  return (
    <div className="App">
      {!token ? (
        <AuthPage setToken={handleSetToken} />
      ) : (
        <PromptGallery />
      )}
    </div>
  );
}

export default App;