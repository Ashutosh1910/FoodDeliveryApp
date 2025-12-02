import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Utensils, Clock, Star, CreditCard, ChefHat, TrendingUp } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isSeller } = useAuth();

  const features = [
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Get your food delivered quickly to your doorstep',
      color: 'text-blue-500'
    },
    {
      icon: Utensils,
      title: 'Wide Selection',
      description: 'Choose from a variety of restaurants and cuisines',
      color: 'text-green-500'
    },
    {
      icon: Star,
      title: 'Quality Food',
      description: 'Fresh, delicious food from trusted restaurants',
      color: 'text-yellow-500'
    },
    {
      icon: CreditCard,
      title: 'Easy Payment',
      description: 'Simple and secure payment options',
      color: 'text-purple-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              🍕 Welcome to FoodDelivery
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto">
              Order delicious food from your favorite restaurants
            </p>
          </motion.div>
          
          {!isAuthenticated && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-white text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-purple-700 shadow-lg">
                  Login
                </Button>
              </Link>
            </motion.div>
          )}

          {isAuthenticated && !isSeller && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/restaurants">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl">
                  Browse Restaurants
                </Button>
              </Link>
            </motion.div>
          )}

          {isAuthenticated && isSeller && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/seller/dashboard">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-12 sm:h-16 md:h-20">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the best food delivery experience with quality service
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full bg-purple-100 ${feature.color}`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-muted-foreground">Restaurants</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">10k+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">50k+</div>
            <div className="text-muted-foreground">Orders Delivered</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
