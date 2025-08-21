// src/App.js
import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';

const Debate1 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {/* {isLoggedIn ? <Dashboard /> : <Login onLogin={handleLogin} />} */}
      <Dashboard/>
    </div>
  );
};

export default Debate1;
