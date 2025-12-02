from django.urls import path,include
from django.contrib.auth.views import LoginView,LogoutView
from .views import *
urlpatterns=[

 path('login/',LoginView.as_view(template_name='login.html'),name='seller-login'),
 path('logout/',LogoutView.as_view(template_name='logout.html'),name='logout'),
 path('new_seller/',register_seller,name='seller-form'),
 path('',order_list,name='order-list'),
 path('add_item/',add_item.as_view(),name='add-item'),
 path('create_profile/',create_profile,name='create-profile'),
 path('view_items/',ItemList.as_view(),name='item-list'),
 path('<int:pk>/',OrderDetail.as_view(),name='order-detail'),
 path('<int:pk>/send',send_order,name='send-order'),
 path('view_items/<int:pk>/update/',ItemUpdate.as_view(),name='item-update'),



 




 #path('order_list/',P)


    
]