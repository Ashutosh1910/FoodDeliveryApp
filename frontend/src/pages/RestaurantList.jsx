import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import Loading from '../components/Loading';
import './RestaurantList.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [searchTerm]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await restaurantAPI.list(params);
      setRestaurants(response.data.results || response.data);
    } catch (err) {
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading restaurants..." />;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="restaurant-list-container">
      <div className="page-header">
        <h1>Restaurants</h1>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="restaurant-grid">
        {restaurants.length === 0 ? (
          <p>No restaurants found</p>
        ) : (
          restaurants.map((restaurant) => (
            <Link
              to={`/restaurants/${restaurant.id}`}
              key={restaurant.id}
              className="restaurant-card"
            >
              <h3>{restaurant.restraunt_name}</h3>
              <p className="rating">⭐ {restaurant.restraunt_rating_value}</p>
              <p className="seller">by {restaurant.seller_name}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
