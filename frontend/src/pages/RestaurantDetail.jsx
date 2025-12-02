import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, itemAPI, basketAPI } from '../services/api';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Star, ShoppingCart, ArrowLeft, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleAddToCart = async (itemId, itemName) => {
    try {
      await basketAPI.addItem(itemId);
      setSuccessMessage(`${itemName} added to cart!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item to cart');
      setTimeout(() => setError(''), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) return <Loading message="Loading menu..." />;
  if (!restaurant) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-muted-foreground">Restaurant not found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/restaurants')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Restaurants
          </Button>
        </motion.div>

        {/* Restaurant Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl sm:text-4xl mb-2">
                    {restaurant.restraunt_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 text-base">
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {restaurant.seller_phone || 'Not available'}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  {restaurant.restraunt_rating_value}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-center gap-2"
            >
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Menu Items
          </h2>
        </motion.div>

        {/* Menu Grid */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-muted-foreground">No items available at the moment</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 flex flex-col">
                  {item.item_image && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={`http://localhost:8000${item.item_image}`}
                        alt={item.item_name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xl">{item.item_name}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {item.item_rating}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">
                      {item.item_description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <div className="text-2xl font-bold text-purple-600">
                      ${item.item_price}
                    </div>
                    <Button
                      onClick={() => handleAddToCart(item.id, item.item_name)}
                      className="gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
