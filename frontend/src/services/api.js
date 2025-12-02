import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
  getCurrentUser: () => api.get('/auth/user/'),
};

// User Profile endpoints
export const userProfileAPI = {
  getProfile: () => api.get('/user-profiles/me/'),
  createProfile: (data) => api.post('/user-profiles/create_profile/', data),
  updateProfile: (data) => api.patch('/user-profiles/me/', data),
};

// Seller Profile endpoints
export const sellerProfileAPI = {
  getProfile: () => api.get('/seller-profiles/me/'),
  updateProfile: (data) => api.patch('/seller-profiles/me/', data),
};

// Restaurant endpoints
export const restaurantAPI = {
  list: (params) => api.get('/restaurants/', { params }),
  detail: (id) => api.get(`/restaurants/${id}/`),
  create: (data) => api.post('/restaurants/', data),
  update: (id, data) => api.patch(`/restaurants/${id}/`, data),
  delete: (id) => api.delete(`/restaurants/${id}/`),
  getMyRestaurant: () => api.get('/restaurants/my_restaurant/'),
};

// Menu Items endpoints
export const itemAPI = {
  list: (params) => api.get('/items/', { params }),
  detail: (id) => api.get(`/items/${id}/`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/items/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.patch(`/items/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/items/${id}/`),
  getMyItems: () => api.get('/items/my_items/'),
};

// Basket/Cart endpoints
export const basketAPI = {
  getCurrent: () => api.get('/basket/current/'),
  addItem: (itemId) => api.post('/basket/add_item/', { item_id: itemId }),
  removeItem: (basketItemId) => api.post('/basket/remove_item/', { basket_item_id: basketItemId }),
  clear: () => api.post('/basket/clear/'),
  placeOrder: () => api.post('/basket/place_order/'),
};

// Order endpoints
export const orderAPI = {
  list: () => api.get('/orders/'),
  detail: (id) => api.get(`/orders/${id}/`),
  complete: (id) => api.post(`/orders/${id}/complete/`),
};

// Rating endpoints
export const ratingAPI = {
  rateItem: (data) => api.post('/ratings/', data),
  rateRestaurant: (data) => api.post('/restaurant-ratings/', data),
};

export default api;
