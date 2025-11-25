import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';
import { Web3Provider } from './context/Web3Context';
import { initParticles } from './utils/mouseEffects';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize only particles (no mouse effects)
    initParticles();
  }, []);

  return (
    <Web3Provider>
      <Router>
        <div className="App app-container">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Chatbot />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
