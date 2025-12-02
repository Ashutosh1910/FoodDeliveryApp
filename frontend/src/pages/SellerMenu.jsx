import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, itemAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input, Label, Textarea } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft, DollarSign, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';

const SellerMenu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    item_price: '',
    available: true,
    item_image: null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [restaurantRes, itemsRes] = await Promise.all([
        restaurantAPI.detail(restaurantId),
        itemAPI.list({ restaurant: restaurantId })
      ]);
      setRestaurant(restaurantRes.data);
      setItems(itemsRes.data.results || itemsRes.data);
    } catch (err) {
      setError('Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      item_name: '',
      item_description: '',
      item_price: '',
      available: true,
      item_image: null
    });
    setEditingItem(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        restaurant_id: restaurantId
      };

      if (editingItem) {
        await itemAPI.update(editingItem.id, submitData);
      } else {
        await itemAPI.create(submitData);
      }

      await fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      item_description: item.item_description,
      item_price: item.item_price,
      available: item.available,
      item_image: null
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await itemAPI.delete(id);
      await fetchData();
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  if (loading) return <Loading message="Loading menu..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/seller/restaurants')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Restaurants
          </Button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {restaurant?.restraunt_name} - Menu
              </h1>
              <p className="text-muted-foreground">
                Manage menu items for this restaurant
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowCreateForm(!showCreateForm);
              }}
              className="shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </div>
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

        {/* Create/Edit Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8"
          >
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle>
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </CardTitle>
                <CardDescription>
                  {editingItem ? 'Update item details' : 'Add a new item to your menu'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="item_name">Item Name *</Label>
                    <Input
                      id="item_name"
                      name="item_name"
                      value={formData.item_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Margherita Pizza"
                      maxLength={25}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="item_description">Description *</Label>
                    <Textarea
                      id="item_description"
                      name="item_description"
                      value={formData.item_description}
                      onChange={handleInputChange}
                      placeholder="Describe your delicious item..."
                      required
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="item_price">Price *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="item_price"
                        name="item_price"
                        type="number"
                        value={formData.item_price}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="item_image">Item Image</Label>
                    <Input
                      id="item_image"
                      name="item_image"
                      type="file"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="available" className="cursor-pointer">
                      Available for orders
                    </Label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
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

        {/* Menu Items Grid */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Menu Items Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start adding items to your restaurant menu
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Item
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.item_name}</CardTitle>
                    <Badge variant={item.available ? "default" : "destructive"}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {item.item_description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    ${item.item_price}
                  </div>
                  {item.item_image && (
                    <img
                      src={item.item_image}
                      alt={item.item_name}
                      className="w-full h-32 object-cover rounded-md mt-2"
                    />
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(item)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerMenu;
