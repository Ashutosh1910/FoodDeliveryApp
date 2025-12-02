from django.urls import path,include
from .views import *

urlpatterns=[
    path('',check_user,name='home'),
    path('create-profile/',create_profile,name='user-profile'),
    path('home/',home,name='check'),
    path('restaurant_list/',Restraunt_ListView.as_view(),name='res-list'),
    path('restaurant_list/<int:pk>/',RestrauntDetail.as_view(),name='res-detail'),
    path('add_to_basket/<int:pk>/',add_to_basket,name='add-to-basket'),
    path('basket/',view_basket,name='view-basket'),
    path('basket/place_order',place_order,name='place-order'),
    path('basket/rate/<int:pk>/',rate_item,name='rate-item'),
    path('restaurant_list/<int:pk>/rate/',rate_restaurant,name='rate-restaurant'),
    path('basket/<int:pk>/delete/',remove_items,name='remove-item'),









]