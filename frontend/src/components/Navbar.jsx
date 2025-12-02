import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🍕 FoodDelivery
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              {isSeller ? (
                <>
                  <Link to="/seller/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                  <Link to="/seller/menu" className="navbar-link">
                    Menu
                  </Link>
                  <Link to="/seller/orders" className="navbar-link">
                    Orders
                  </Link>
                  <Link to="/seller/profile" className="navbar-link">
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/restaurants" className="navbar-link">
                    Restaurants
                  </Link>
                  <Link to="/cart" className="navbar-link">
                    Cart
                  </Link>
                  <Link to="/orders" className="navbar-link">
                    My Orders
                  </Link>
                  <Link to="/profile" className="navbar-link">
                    Profile
                  </Link>
                </>
              )}
              <span className="navbar-user">👤 {user?.username}</span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
              <Link to="/register" className="navbar-button navbar-button-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
