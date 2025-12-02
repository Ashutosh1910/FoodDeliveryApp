# Quick Start Guide

This guide will help you get the Food Delivery App up and running in 5 minutes.

## Prerequisites

Make sure you have installed:
- Python 3.8 or higher
- Node.js 18 or higher
- npm (comes with Node.js)

## Step 1: Start the Backend

Open a terminal and run:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional - for admin access)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

Backend will be running at: **http://localhost:8000**

API Documentation available at:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Step 2: Start the Frontend

Open a **new terminal** (keep backend running) and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be running at: **http://localhost:5173**

## Step 3: Test the Application

1. Open your browser and go to http://localhost:5173
2. Click "Register" to create a new account
3. Choose "Customer" or "Restaurant Seller"
4. Complete registration
5. Explore the application!

### For Customers:
- Browse restaurants
- View menu items
- Add items to cart
- Place orders
- View order history

### For Sellers:
- View incoming orders
- Mark orders as complete
- Manage your restaurant

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
python manage.py runserver 8080
# Then update frontend/.env: VITE_API_URL=http://localhost:8080/api
```

**Database errors:**
```bash
rm db.sqlite3
python manage.py migrate
```

### Frontend Issues

**Port 5173 already in use:**
The dev server will automatically try the next available port.

**CORS errors:**
Make sure backend is running and CORS is properly configured in backend/config/settings.py

**API connection errors:**
Check that `VITE_API_URL` in frontend/.env points to your backend URL (default: http://localhost:8000/api)

## Next Steps

- Create sample restaurants and menu items
- Test the complete order flow
- Explore the API documentation
- Check the README.md for production deployment

## Default Credentials

If you created a superuser, you can access Django admin at:
http://localhost:8000/admin/

Happy coding! 🚀
