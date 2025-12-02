import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Menu, X, ShoppingCart, User, LogOut, UtensilsCrossed, Store, Package } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl sm:text-2xl font-bold hover:text-purple-200 transition-colors">
            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="hidden sm:inline">FoodDelivery</span>
            <span className="sm:hidden">FD</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isSeller ? (
                  <>
                    <Link to="/seller/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                      <Store className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link to="/seller/restaurants" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                      <UtensilsCrossed className="h-4 w-4" />
                      My Restaurants
                    </Link>
                    <Link to="/seller/orders" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                      <Package className="h-4 w-4" />
                      Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/restaurants" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                      <UtensilsCrossed className="h-4 w-4" />
                      Restaurants
                    </Link>
                    <Link to="/cart" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2 px-3 py-2 text-purple-100">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user?.username}</span>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-purple-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-white text-purple-700 hover:bg-purple-50">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-purple-100 border-b border-white/20 mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  {isSeller ? (
                    <>
                      <Link 
                        to="/seller/dashboard" 
                        onClick={toggleMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                      >
                        <Store className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/seller/restaurants" 
                        onClick={toggleMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                      >
                        <UtensilsCrossed className="h-4 w-4" />
                        My Restaurants
                      </Link>
                      <Link 
                        to="/seller/orders" 
                        onClick={toggleMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/restaurants" 
                        onClick={toggleMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                      >
                        <UtensilsCrossed className="h-4 w-4" />
                        Restaurants
                      </Link>
                      <Link 
                        to="/cart" 
                        onClick={toggleMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={toggleMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    </>
                  )}
                  <Button 
                    onClick={() => { handleLogout(); toggleMenu(); }} 
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white hover:text-purple-700 mt-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="ghost" className="w-full text-white hover:bg-white/10 justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button className="w-full bg-white text-purple-700 hover:bg-purple-50">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
