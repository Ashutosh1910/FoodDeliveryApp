from rest_framework import viewsets, status, generics, permissions, serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Avg

from .serializers import (
    UserSerializer, UserProfileSerializer, SellerProfileSerializer,
    RestrauntSerializer, ItemSerializer, BasketSerializer, BasketItemSerializer,
    PendingOrderSerializer, PendingOrderItemSerializer, RatingSerializer,
    RestrauntRatingSerializer, UserRegistrationSerializer
)
from user_interface.models import User_Profile, Basket, Basket_Item
from seller_interface.models import (
    Seller_Profile, Restraunt, Item, Pending_Order,
    Pending_Order_Item, Rating, Restraunt_rating
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user (customer or seller)"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user and return JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        
        # Determine user type
        user_type = 'user'
        if hasattr(user, 'seller_profile'):
            user_type = 'seller'
        
        return Response({
            'user': UserSerializer(user).data,
            'user_type': user_type,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
        }, status=status.HTTP_200_OK)
    
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user by blacklisting refresh token"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current authenticated user information"""
    serializer = UserSerializer(request.user)
    
    # Get user type and profile
    user_type = 'user'
    profile = None
    
    if hasattr(request.user, 'seller_profile'):
        user_type = 'seller'
        profile = SellerProfileSerializer(request.user.seller_profile).data
    elif hasattr(request.user, 'user_profile'):
        profile = UserProfileSerializer(request.user.user_profile).data
    
    return Response({
        'user': serializer.data,
        'user_type': user_type,
        'profile': profile
    })


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for User Profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own profile
        if self.request.user.is_staff:
            return User_Profile.objects.all()
        return User_Profile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current user's profile"""
        try:
            profile = User_Profile.objects.get(user=request.user)
        except User_Profile.DoesNotExist:
            return Response(
                {'error': 'Profile not found. Please create a profile first.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            partial = request.method == 'PATCH'
            serializer = self.get_serializer(profile, data=request.data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def create_profile(self, request):
        """Create a profile for the current user"""
        if User_Profile.objects.filter(user=request.user).exists():
            return Response(
                {'error': 'Profile already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user profile
        profile = User_Profile.objects.create(
            user=request.user,
            name=request.data.get('name', ''),
            hostel=request.data.get('hostel', 'SR'),
            room_no=request.data.get('room_no', 100),
            user_branch=request.data.get('user_branch', 'A7')
        )
        
        # Generate bits_id if email is available
        if request.user.email:
            email = request.user.email
            branch = profile.user_branch
            try:
                profile.bits_id = f"{email[1:5]}{branch}PS{email[5:9]}P"
                profile.save()
            except:
                pass
        
        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SellerProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for Seller Profile"""
    serializer_class = SellerProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Sellers can only see their own profile
        if self.request.user.is_staff:
            return Seller_Profile.objects.all()
        return Seller_Profile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current seller's profile"""
        try:
            profile = Seller_Profile.objects.get(user=request.user)
        except Seller_Profile.DoesNotExist:
            return Response(
                {'error': 'Seller profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            partial = request.method == 'PATCH'
            serializer = self.get_serializer(profile, data=request.data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RestrauntViewSet(viewsets.ModelViewSet):
    """ViewSet for Restaurant"""
    serializer_class = RestrauntSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Restraunt.objects.all()
        
        # Filter by search query if provided
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(restraunt_name__icontains=search)
        
        return queryset
    
    def perform_create(self, serializer):
        # Create restaurant for current seller
        try:
            seller_profile = Seller_Profile.objects.get(user=self.request.user)
            serializer.save(of_seller=seller_profile)
        except Seller_Profile.DoesNotExist:
            raise serializers.ValidationError("Seller profile not found")
    
    @action(detail=False, methods=['get'])
    def my_restaurant(self, request):
        """Get current seller's first restaurant (for backward compatibility)"""
        try:
            seller_profile = Seller_Profile.objects.get(user=request.user)
            restaurant = Restraunt.objects.filter(of_seller=seller_profile).first()
            if restaurant:
                serializer = self.get_serializer(restaurant)
                return Response(serializer.data)
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Seller_Profile.DoesNotExist:
            return Response(
                {'error': 'Seller profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def my_restaurants(self, request):
        """Get all restaurants owned by current seller"""
        try:
            seller_profile = Seller_Profile.objects.get(user=request.user)
            restaurants = Restraunt.objects.filter(of_seller=seller_profile)
            serializer = self.get_serializer(restaurants, many=True)
            return Response(serializer.data)
        except Seller_Profile.DoesNotExist:
            return Response(
                {'error': 'Seller profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ItemViewSet(viewsets.ModelViewSet):
    """ViewSet for Menu Items"""
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Item.objects.all()
        
        # Filter by restaurant
        restaurant_id = self.request.query_params.get('restaurant', None)
        if restaurant_id:
            queryset = queryset.filter(of_restraunt_id=restaurant_id)
        
        # Filter by availability
        available = self.request.query_params.get('available', None)
        if available is not None:
            queryset = queryset.filter(available=available.lower() == 'true')
        
        return queryset
    
    def perform_create(self, serializer):
        # Create item for specified restaurant or seller's first restaurant
        restaurant_id = self.request.data.get('restaurant_id')
        try:
            seller_profile = Seller_Profile.objects.get(user=self.request.user)
            if restaurant_id:
                # Verify the restaurant belongs to the seller
                restaurant = Restraunt.objects.get(id=restaurant_id, of_seller=seller_profile)
            else:
                # Default to first restaurant for backward compatibility
                restaurant = Restraunt.objects.filter(of_seller=seller_profile).first()
                if not restaurant:
                    raise serializers.ValidationError("No restaurant found for this seller")
            serializer.save(of_restraunt=restaurant)
        except Seller_Profile.DoesNotExist:
            raise serializers.ValidationError("Seller profile not found")
        except Restraunt.DoesNotExist:
            raise serializers.ValidationError("Restaurant not found or doesn't belong to this seller")
    
    @action(detail=False, methods=['get'])
    def my_items(self, request):
        """Get items for current seller's restaurants"""
        restaurant_id = request.query_params.get('restaurant_id')
        try:
            seller_profile = Seller_Profile.objects.get(user=request.user)
            if restaurant_id:
                # Get items for specific restaurant
                restaurant = Restraunt.objects.get(id=restaurant_id, of_seller=seller_profile)
                items = Item.objects.filter(of_restraunt=restaurant)
            else:
                # Get items for all seller's restaurants
                restaurants = Restraunt.objects.filter(of_seller=seller_profile)
                items = Item.objects.filter(of_restraunt__in=restaurants)
            serializer = self.get_serializer(items, many=True)
            return Response(serializer.data)
        except Seller_Profile.DoesNotExist:
            return Response(
                {'error': 'Seller profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Restraunt.DoesNotExist:
            return Response(
                {'error': 'Restaurant not found or doesn\'t belong to this seller'},
                status=status.HTTP_404_NOT_FOUND
            )


class BasketViewSet(viewsets.ModelViewSet):
    """ViewSet for Shopping Basket"""
    serializer_class = BasketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can only see their own basket
        try:
            user_profile = User_Profile.objects.get(user=self.request.user)
            return Basket.objects.filter(owner=user_profile)
        except User_Profile.DoesNotExist:
            return Basket.objects.none()
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current user's basket"""
        try:
            user_profile = User_Profile.objects.get(user=request.user)
            basket = Basket.objects.get(owner=user_profile)
            serializer = self.get_serializer(basket)
            return Response(serializer.data)
        except User_Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Basket.DoesNotExist:
            return Response(
                {'message': 'Basket is empty', 'basket': None},
                status=status.HTTP_200_OK
            )
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to basket"""
        try:
            user_profile = User_Profile.objects.get(user=request.user)
            item_id = request.data.get('item_id')
            
            if not item_id:
                return Response(
                    {'error': 'item_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            item = Item.objects.get(pk=item_id)
            
            # Get or create basket
            basket, created = Basket.objects.get_or_create(
                owner=user_profile,
                defaults={'of_restraunt': item.of_restraunt}
            )
            
            # Check if item is from same restaurant
            if basket.of_restraunt != item.of_restraunt:
                return Response(
                    {'error': "You can't order from two restaurants at the same time"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Add or update item in basket
            basket_item, item_created = Basket_Item.objects.get_or_create(
                basket=basket,
                item_name=item.item_name,
                defaults={
                    'item_cost': item.item_price,
                    'item_description': item.item_description,
                    'item_image': item.item_image,
                }
            )
            
            if not item_created:
                basket_item.item_quantity += 1
                basket_item.save()
            
            # Update basket totals
            basket.no_of_items += 1
            basket.total_cost += item.item_price
            basket.save()
            
            return Response({
                'message': f'{item.item_name} added to basket',
                'basket': BasketSerializer(basket).data
            }, status=status.HTTP_200_OK)
            
        except User_Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Item.DoesNotExist:
            return Response(
                {'error': 'Item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from basket"""
        try:
            basket_item_id = request.data.get('basket_item_id')
            
            if not basket_item_id:
                return Response(
                    {'error': 'basket_item_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            basket_item = Basket_Item.objects.get(pk=basket_item_id)
            basket = basket_item.basket
            
            # Update basket totals
            basket.total_cost -= basket_item.item_quantity * basket_item.item_cost
            basket.no_of_items -= basket_item.item_quantity
            basket.save()
            
            # Delete item
            basket_item.delete()
            
            # If basket is empty, delete it
            if basket.no_of_items <= 0:
                basket.delete()
                return Response(
                    {'message': 'Item removed and basket cleared'},
                    status=status.HTTP_200_OK
                )
            
            return Response({
                'message': 'Item removed from basket',
                'basket': BasketSerializer(basket).data
            }, status=status.HTTP_200_OK)
            
        except Basket_Item.DoesNotExist:
            return Response(
                {'error': 'Basket item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear all items from basket"""
        try:
            user_profile = User_Profile.objects.get(user=request.user)
            basket = Basket.objects.get(owner=user_profile)
            basket.delete()
            return Response(
                {'message': 'Basket cleared'},
                status=status.HTTP_200_OK
            )
        except (User_Profile.DoesNotExist, Basket.DoesNotExist):
            return Response(
                {'message': 'No basket to clear'},
                status=status.HTTP_200_OK
            )
    
    @action(detail=False, methods=['post'])
    def place_order(self, request):
        """Place order from basket"""
        try:
            user_profile = User_Profile.objects.get(user=request.user)
            basket = Basket.objects.get(owner=user_profile)
            
            # Create order
            order = Pending_Order.objects.create(
                of_student=user_profile,
                order_to=basket.of_restraunt,
                order_price=basket.total_cost,
                no_of_items=basket.no_of_items
            )
            
            # Create order items
            for basket_item in basket.basket_item_set.all():
                Pending_Order_Item.objects.create(
                    of_order=order,
                    item_name=basket_item.item_name,
                    item_price=basket_item.item_cost,
                    item_quantity=basket_item.item_quantity
                )
            
            # Clear basket
            basket.delete()
            
            return Response({
                'message': 'Order placed successfully',
                'order_id': order.id,
                'order': PendingOrderSerializer(order).data
            }, status=status.HTTP_201_CREATED)
            
        except User_Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Basket.DoesNotExist:
            return Response(
                {'error': 'Basket is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Orders"""
    serializer_class = PendingOrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # For sellers, show orders for their restaurant
        if hasattr(user, 'seller_profile'):
            try:
                restaurant = Restraunt.objects.get(of_seller=user.seller_profile)
                return Pending_Order.objects.filter(order_to=restaurant)
            except Restraunt.DoesNotExist:
                return Pending_Order.objects.none()
        
        # For users, show their own orders
        try:
            user_profile = User_Profile.objects.get(user=user)
            return Pending_Order.objects.filter(of_student=user_profile)
        except User_Profile.DoesNotExist:
            return Pending_Order.objects.none()
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark order as completed (seller only)"""
        order = self.get_object()
        
        # Check if user is the seller of the restaurant
        try:
            seller_profile = Seller_Profile.objects.get(user=request.user)
            restaurant = Restraunt.objects.get(of_seller=seller_profile)
            
            if order.order_to != restaurant:
                return Response(
                    {'error': 'You can only complete orders for your restaurant'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            order.delete()  # In the current system, completed orders are deleted
            
            return Response(
                {'message': 'Order completed and dispatched'},
                status=status.HTTP_200_OK
            )
            
        except (Seller_Profile.DoesNotExist, Restraunt.DoesNotExist):
            return Response(
                {'error': 'Only sellers can complete orders'},
                status=status.HTTP_403_FORBIDDEN
            )


class RatingViewSet(viewsets.ModelViewSet):
    """ViewSet for Item Ratings"""
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    queryset = Rating.objects.all()
    
    def perform_create(self, serializer):
        # Update or create rating
        item_id = self.request.data.get('rated_item')
        existing_rating = Rating.objects.filter(
            rating_by=self.request.user,
            rated_item_id=item_id
        ).first()
        
        if existing_rating:
            existing_rating.rating_value = self.request.data.get('rating_value')
            existing_rating.save()
            
            # Update item average rating
            item = Item.objects.get(pk=item_id)
            avg_rating = Rating.objects.filter(rated_item=item).aggregate(Avg('rating_value'))
            item.item_rating = avg_rating['rating_value__avg'] or 5.0
            item.save()
            
            return existing_rating
        else:
            rating = serializer.save(rating_by=self.request.user)
            
            # Update item average rating
            item = rating.rated_item
            avg_rating = Rating.objects.filter(rated_item=item).aggregate(Avg('rating_value'))
            item.item_rating = avg_rating['rating_value__avg'] or 5.0
            item.save()
            
            return rating


class RestrauntRatingViewSet(viewsets.ModelViewSet):
    """ViewSet for Restaurant Ratings"""
    serializer_class = RestrauntRatingSerializer
    permission_classes = [IsAuthenticated]
    queryset = Restraunt_rating.objects.all()
    
    def perform_create(self, serializer):
        # Update or create rating
        restaurant_id = self.request.data.get('rated_restraunt')
        existing_rating = Restraunt_rating.objects.filter(
            rating_by=self.request.user,
            rated_restraunt_id=restaurant_id
        ).first()
        
        if existing_rating:
            existing_rating.rating_value = self.request.data.get('rating_value')
            existing_rating.save()
            
            # Update restaurant average rating
            restaurant = Restraunt.objects.get(pk=restaurant_id)
            avg_rating = Restraunt_rating.objects.filter(rated_restraunt=restaurant).aggregate(Avg('rating_value'))
            restaurant.restraunt_rating_value = avg_rating['rating_value__avg'] or 5.0
            restaurant.save()
            
            return existing_rating
        else:
            rating = serializer.save(rating_by=self.request.user)
            
            # Update restaurant average rating
            restaurant = rating.rated_restraunt
            avg_rating = Restraunt_rating.objects.filter(rated_restraunt=restaurant).aggregate(Avg('rating_value'))
            restaurant.restraunt_rating_value = avg_rating['rating_value__avg'] or 5.0
            restaurant.save()
            
            return rating
