# FoodDelivery App - Modern Full Stack Application

A complete food delivery application built with Django REST Framework backend and React frontend.

## 🚀 Tech Stack

### Backend
- **Framework**: Django 4.2.9 + Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (easily migrated to PostgreSQL)
- **API Documentation**: Swagger/ReDoc (drf-yasg)
- **CORS**: django-cors-headers

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 (modular)

## 📁 Project Structure

```
FoodDeliveryApp/
├── backend/                    # Django REST API
│   ├── config/                # Django project settings
│   ├── api/                   # API app with serializers, views, URLs
│   ├── user_interface/        # User models & logic
│   ├── seller_interface/      # Seller models & logic
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── context/           # React Context
│   │   └── App.jsx            # Main app component
│   └── package.json
│
└── README.md                   # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
# Edit .env with your settings
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
# Update VITE_API_URL if backend is not on localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📚 API Documentation

Once the backend is running, access the API documentation at:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

### Key API Endpoints

#### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user info
- `POST /api/auth/token/refresh/` - Refresh JWT token

#### Restaurants
- `GET /api/restaurants/` - List all restaurants
- `GET /api/restaurants/{id}/` - Get restaurant details
- `POST /api/restaurants/` - Create restaurant (seller only)
- `GET /api/restaurants/my_restaurant/` - Get seller's restaurant

#### Menu Items
- `GET /api/items/` - List menu items
- `GET /api/items/{id}/` - Get item details
- `POST /api/items/` - Create item (seller only)
- `PATCH /api/items/{id}/` - Update item (seller only)
- `DELETE /api/items/{id}/` - Delete item (seller only)

#### Basket/Cart
- `GET /api/basket/current/` - Get current user's basket
- `POST /api/basket/add_item/` - Add item to basket
- `POST /api/basket/remove_item/` - Remove item from basket
- `POST /api/basket/place_order/` - Place order

#### Orders
- `GET /api/orders/` - List user's orders
- `GET /api/orders/{id}/` - Get order details
- `POST /api/orders/{id}/complete/` - Complete order (seller only)

## 🎯 Features

### For Customers
- ✅ Browse restaurants and menus
- ✅ Add items to cart
- ✅ Place orders
- ✅ View order history
- ✅ Rate restaurants and items
- ✅ User profile management

### For Sellers
- ✅ Restaurant dashboard
- ✅ Menu management (CRUD)
- ✅ View incoming orders
- ✅ Mark orders as complete
- ✅ Profile settings

### Technical Features
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ API documentation

## 🔒 Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## 🚢 Production Deployment

### Backend
1. Set `DEBUG=False` in settings
2. Configure proper `SECRET_KEY`
3. Set up PostgreSQL database
4. Configure static files serving
5. Use a production WSGI server (gunicorn)

### Frontend
1. Build the production bundle:
```bash
npm run build
```
2. Serve the `dist/` directory with a web server (nginx, Apache, etc.)
3. Configure environment variables for production API URL

## 📝 Development Notes

- The original Django templates are preserved in `backend/templates/` for reference
- The database is SQLite by default but can be easily switched to PostgreSQL
- JWT tokens have a 1-hour expiration with 7-day refresh tokens
- CORS is configured for local development (adjust for production)

## 📄 License

This project is for educational purposes.
