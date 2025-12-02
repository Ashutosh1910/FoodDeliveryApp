from rest_framework import serializers
from django.contrib.auth.models import User
from user_interface.models import User_Profile, Basket, Basket_Item
from seller_interface.models import (
    Seller_Profile, Restraunt, Item, Pending_Order, 
    Pending_Order_Item, Rating, Restraunt_rating
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for Django User model"""
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for User_Profile model"""
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = User_Profile
        fields = ['id', 'user', 'username', 'email', 'name', 'bits_id', 'hostel', 'room_no', 'user_branch']
        read_only_fields = ['id', 'bits_id']


class SellerProfileSerializer(serializers.ModelSerializer):
    """Serializer for Seller_Profile model"""
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Seller_Profile
        fields = ['id', 'user', 'username', 'email', 'seller_phone_no']
        read_only_fields = ['id']


class RestrauntSerializer(serializers.ModelSerializer):
    """Serializer for Restaurant model"""
    seller_name = serializers.CharField(source='of_seller.user.username', read_only=True)
    seller_phone = serializers.IntegerField(source='of_seller.seller_phone_no', read_only=True)
    
    class Meta:
        model = Restraunt
        fields = ['id', 'restraunt_name', 'restraunt_rating_value', 'of_seller', 'seller_name', 'seller_phone']
        read_only_fields = ['id', 'restraunt_rating_value']


class ItemSerializer(serializers.ModelSerializer):
    """Serializer for Menu Item model"""
    restaurant_name = serializers.CharField(source='of_restraunt.restraunt_name', read_only=True)
    
    class Meta:
        model = Item
        fields = ['id', 'item_name', 'item_price', 'item_description', 'item_image', 
                  'available', 'item_rating', 'of_restraunt', 'restaurant_name']
        read_only_fields = ['id', 'item_rating']


class BasketItemSerializer(serializers.ModelSerializer):
    """Serializer for Basket_Item model"""
    total_cost_item = serializers.ReadOnlyField()
    
    class Meta:
        model = Basket_Item
        fields = ['id', 'item_name', 'item_description', 'item_cost', 
                  'item_quantity', 'item_image', 'total_cost_item']
        read_only_fields = ['id']


class BasketSerializer(serializers.ModelSerializer):
    """Serializer for Basket model"""
    items = BasketItemSerializer(source='basket_item_set', many=True, read_only=True)
    restaurant_name = serializers.CharField(source='of_restraunt.restraunt_name', read_only=True)
    restaurant_id = serializers.IntegerField(source='of_restraunt.id', read_only=True)
    
    class Meta:
        model = Basket
        fields = ['id', 'no_of_items', 'total_cost', 'of_restraunt', 
                  'restaurant_name', 'restaurant_id', 'items']
        read_only_fields = ['id', 'no_of_items', 'total_cost']


class PendingOrderItemSerializer(serializers.ModelSerializer):
    """Serializer for Pending_Order_Item model"""
    
    class Meta:
        model = Pending_Order_Item
        fields = ['id', 'item_name', 'item_price', 'item_quantity']
        read_only_fields = ['id']


class PendingOrderSerializer(serializers.ModelSerializer):
    """Serializer for Pending_Order model"""
    items = PendingOrderItemSerializer(source='pending_order_item_set', many=True, read_only=True)
    student_name = serializers.CharField(source='of_student.name', read_only=True)
    student_bits_id = serializers.CharField(source='of_student.bits_id', read_only=True)
    student_hostel = serializers.CharField(source='of_student.hostel', read_only=True)
    student_room = serializers.IntegerField(source='of_student.room_no', read_only=True)
    restaurant_name = serializers.CharField(source='order_to.restraunt_name', read_only=True)
    
    class Meta:
        model = Pending_Order
        fields = ['id', 'order_price', 'no_of_items', 'of_student', 'order_to',
                  'student_name', 'student_bits_id', 'student_hostel', 'student_room',
                  'restaurant_name', 'items']
        read_only_fields = ['id']


class RatingSerializer(serializers.ModelSerializer):
    """Serializer for Item Rating model"""
    user_name = serializers.CharField(source='rating_by.username', read_only=True)
    item_name = serializers.CharField(source='rated_item.item_name', read_only=True)
    
    class Meta:
        model = Rating
        fields = ['id', 'rating_value', 'rating_by', 'rated_item', 'user_name', 'item_name']
        read_only_fields = ['id']


class RestrauntRatingSerializer(serializers.ModelSerializer):
    """Serializer for Restaurant Rating model"""
    user_name = serializers.CharField(source='rating_by.username', read_only=True)
    restaurant_name = serializers.CharField(source='rated_restraunt.restraunt_name', read_only=True)
    
    class Meta:
        model = Restraunt_rating
        fields = ['id', 'rating_value', 'rating_by', 'rated_restraunt', 'user_name', 'restaurant_name']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for User Registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    user_type = serializers.ChoiceField(choices=['user', 'seller'], write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'user_type']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user_type = validated_data.pop('user_type')
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create profile based on user type
        if user_type == 'seller':
            Seller_Profile.objects.create(user=user)
        
        return user
