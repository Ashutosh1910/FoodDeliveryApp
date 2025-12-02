from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'user-profiles', views.UserProfileViewSet, basename='user-profile')
router.register(r'seller-profiles', views.SellerProfileViewSet, basename='seller-profile')
router.register(r'restaurants', views.RestrauntViewSet, basename='restaurant')
router.register(r'items', views.ItemViewSet, basename='item')
router.register(r'basket', views.BasketViewSet, basename='basket')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'ratings', views.RatingViewSet, basename='rating')
router.register(r'restaurant-ratings', views.RestrauntRatingViewSet, basename='restaurant-rating')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', views.current_user, name='current_user'),
    
    # Include router URLs
    path('', include(router.urls)),
]
