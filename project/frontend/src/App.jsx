import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Authorization from './pages/Authorization';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/authorization' element={<Authorization />} />
      </Routes>
    </div>
  );
}

export default App;