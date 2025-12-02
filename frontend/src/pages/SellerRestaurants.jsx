import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI, itemAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Textarea } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Store, Edit, Trash2, Star, UtensilsCrossed, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';

const SellerRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    restraunt_name: '',
    restraunt_rating_value: '5.0'
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getMyRestaurants();
      setRestaurants(response.data);
    } catch (err) {
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await restaurantAPI.create(formData);
      await fetchRestaurants();
      setShowCreateForm(false);
      setFormData({ restraunt_name: '', restraunt_rating_value: '5.0' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      await restaurantAPI.delete(id);
      await fetchRestaurants();
    } catch (err) {
      setError('Failed to delete restaurant');
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

  if (loading) return <Loading message="Loading your restaurants..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              My Restaurants
            </h1>
            <p className="text-muted-foreground">
              Manage your restaurants and menus
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Restaurant
          </Button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-start gap-2"
          >
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Create Restaurant Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle>Create New Restaurant</CardTitle>
                <CardDescription>
                  Add a new restaurant to your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRestaurant} className="space-y-4">
                  <div>
                    <Label htmlFor="restraunt_name">Restaurant Name *</Label>
                    <Input
                      id="restraunt_name"
                      name="restraunt_name"
                      value={formData.restraunt_name}
                      onChange={handleInputChange}
                      placeholder="Enter restaurant name"
                      maxLength={15}
                      required
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 15 characters
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? 'Creating...' : 'Create Restaurant'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Restaurants Grid */}
        {restaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Store className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Restaurants Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first restaurant to start selling
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Restaurant
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {restaurants.map((restaurant) => (
              <motion.div key={restaurant.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">
                        {restaurant.restraunt_name}
                      </CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.restraunt_rating_value}
                      </Badge>
                    </div>
                    <CardDescription>
                      Restaurant ID: #{restaurant.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span>Manage your menu items</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/seller/menu/${restaurant.id}`)}
                      className="flex-1"
                      variant="default"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Manage Menu
                    </Button>
                    <Button
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
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

export default SellerRestaurants;
