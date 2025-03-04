import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Authorization from './pages/Authorization';
import Profile from './pages/Profile';
import Executor from './pages/Executor';

// services
import Web from './pages/servises/web';
import Mob from './pages/servises/mob'
import Cloud from './pages/servises/cloud'
import Seo from './pages/servises/seo';
import Digital from './pages/servises/digital'
import Cybersecurity from './pages/servises/cybersecurity'
import Consulting from './pages/servises/consulting'
import Analytics from './pages/servises/analytics'


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/authorization' element={<Authorization />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/executor" element={<Executor />} />
        {/* servises */}
        <Route path="/web" element={<Web />} />
        <Route path="/mobile-development" element={<Mob />} />
        <Route path="/seo" element={<Seo />} />
        <Route path="/digital-marketing" element={<Digital />} />
        <Route path="/cybersecurity" element={<Cybersecurity />} />
        <Route path="/data-analytics" element={<Analytics />} />
        <Route path="/consulting" element={<Consulting />} />
        <Route path="/cloud-solutions" element={<Cloud />} />

      </Routes>
    </div>
  );
}

export default App;