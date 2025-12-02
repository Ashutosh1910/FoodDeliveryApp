import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantAPI, itemAPI, basketAPI } from '../services/api';
import Loading from '../components/Loading';
import './RestaurantList.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRestaurantAndItems();
  }, [id]);

  const fetchRestaurantAndItems = async () => {
    try {
      setLoading(true);
      const [restaurantRes, itemsRes] = await Promise.all([
        restaurantAPI.detail(id),
        itemAPI.list({ restaurant: id, available: true })
      ]);
      setRestaurant(restaurantRes.data);
      setItems(itemsRes.data.results || itemsRes.data);
    } catch (err) {
      setError('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      await basketAPI.addItem(itemId);
      setSuccessMessage('Item added to cart!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add item to cart');
    }
  };

  if (loading) return <Loading message="Loading menu..." />;
  if (error) return <div className="error-container">{error}</div>;
  if (!restaurant) return <div className="error-container">Restaurant not found</div>;

  return (
    <div className="restaurant-detail-container">
      <div className="page-header">
        <h1>{restaurant.restraunt_name}</h1>
        <p className="rating">⭐ {restaurant.restraunt_rating_value}</p>
        <p>Seller: {restaurant.seller_name} | Phone: {restaurant.seller_phone}</p>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <h2>Menu Items</h2>
      <div className="menu-grid">
        {items.length === 0 ? (
          <p>No items available</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="menu-item">
              {item.item_image && (
                <img
                  src={`http://localhost:8000${item.item_image}`}
                  alt={item.item_name}
                />
              )}
              <h3>{item.item_name}</h3>
              <p className="price">₹{item.item_price}</p>
              <p className="description">{item.item_description}</p>
              <p className="rating">⭐ {item.item_rating}</p>
              <button onClick={() => handleAddToCart(item.id)}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
