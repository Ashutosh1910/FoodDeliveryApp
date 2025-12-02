import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, isSeller } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🍕 Welcome to FoodDelivery</h1>
        <p className="hero-subtitle">
          Order delicious food from your favorite restaurants
        </p>
        
        {!isAuthenticated && (
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Login
            </Link>
          </div>
        )}

        {isAuthenticated && !isSeller && (
          <Link to="/restaurants" className="btn btn-primary btn-large">
            Browse Restaurants
          </Link>
        )}

        {isAuthenticated && isSeller && (
          <Link to="/seller/dashboard" className="btn btn-primary btn-large">
            Go to Dashboard
          </Link>
        )}
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🚀</span>
            <h3>Fast Delivery</h3>
            <p>Get your food delivered quickly to your doorstep</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🍽️</span>
            <h3>Wide Selection</h3>
            <p>Choose from a variety of restaurants and cuisines</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💯</span>
            <h3>Quality Food</h3>
            <p>Fresh, delicious food from trusted restaurants</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💳</span>
            <h3>Easy Payment</h3>
            <p>Simple and secure payment options</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
