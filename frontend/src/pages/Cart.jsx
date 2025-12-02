import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { basketAPI } from '../services/api';
import Loading from '../components/Loading';
import './Cart.css';

const Cart = () => {
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBasket();
  }, []);

  const fetchBasket = async () => {
    try {
      setLoading(true);
      const response = await basketAPI.getCurrent();
      setBasket(response.data.basket);
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (basketItemId) => {
    try {
      await basketAPI.removeItem(basketItemId);
      fetchBasket();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await basketAPI.placeOrder();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to place order');
    }
  };

  if (loading) return <Loading message="Loading cart..." />;
  if (error) return <div className="error-container">{error}</div>;

  if (!basket || basket.items?.length === 0) {
    return (
      <div className="cart-container">
        <h1>Your Cart</h1>
        <p className="empty-cart">Your cart is empty</p>
        <button onClick={() => navigate('/restaurants')} className="btn btn-primary">
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <p className="restaurant-info">From: {basket.restaurant_name}</p>

      <div className="cart-items">
        {basket.items.map((item) => (
          <div key={item.id} className="cart-item">
            {item.item_image && (
              <img src={`http://localhost:8000${item.item_image}`} alt={item.item_name} />
            )}
            <div className="item-details">
              <h3>{item.item_name}</h3>
              <p>{item.item_description}</p>
              <p className="quantity">Quantity: {item.item_quantity}</p>
            </div>
            <div className="item-price">
              <p>₹{item.item_cost} × {item.item_quantity}</p>
              <p className="total">₹{item.total_cost_item}</p>
              <button onClick={() => handleRemoveItem(item.id)} className="btn-remove">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Items:</span>
          <span>{basket.no_of_items}</span>
        </div>
        <div className="summary-row total-row">
          <span>Total:</span>
          <span>₹{basket.total_cost}</span>
        </div>
        <button onClick={handlePlaceOrder} className="btn btn-primary btn-place-order">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
