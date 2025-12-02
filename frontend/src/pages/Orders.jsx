import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import Loading from '../components/Loading';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.list();
      setOrders(response.data.results || response.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await orderAPI.complete(orderId);
      fetchOrders();
      alert('Order completed successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete order');
    }
  };

  if (loading) return <Loading message="Loading orders..." />;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      
      {orders.length === 0 ? (
        <p className="empty-state">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <p className="order-total">₹{order.order_price}</p>
              </div>
              
              <div className="order-info">
                <p><strong>Restaurant:</strong> {order.restaurant_name}</p>
                <p><strong>Items:</strong> {order.no_of_items}</p>
                {order.student_name && (
                  <>
                    <p><strong>Customer:</strong> {order.student_name}</p>
                    <p><strong>Location:</strong> {order.student_hostel}, Room {order.student_room}</p>
                  </>
                )}
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.item_name}</span>
                    <span>x{item.item_quantity}</span>
                    <span>₹{item.item_price}</span>
                  </div>
                ))}
              </div>

              {order.student_name && (
                <button
                  onClick={() => handleCompleteOrder(order.id)}
                  className="btn btn-success"
                >
                  Complete Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
