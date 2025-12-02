import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import SellerRestaurants from './pages/SellerRestaurants';
import SellerMenu from './pages/SellerMenu';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Seller Route Component
const SellerRoute = ({ children }) => {
  const { isAuthenticated, isSeller, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return isSeller ? children : <Navigate to="/restaurants" />;
};

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/restaurants" element={
            <ProtectedRoute><RestaurantList /></ProtectedRoute>
          } />
          <Route path="/restaurants/:id" element={
            <ProtectedRoute><RestaurantDetail /></ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          
          <Route path="/seller/dashboard" element={
            <SellerRoute><SellerRestaurants /></SellerRoute>
          } />
          <Route path="/seller/restaurants" element={
            <SellerRoute><SellerRestaurants /></SellerRoute>
          } />
          <Route path="/seller/menu/:restaurantId" element={
            <SellerRoute><SellerMenu /></SellerRoute>
          } />
          <Route path="/seller/orders" element={
            <SellerRoute><Orders /></SellerRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
