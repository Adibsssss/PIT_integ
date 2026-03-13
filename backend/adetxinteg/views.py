from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db import transaction # ADDED THIS IMPORT

from .models import Product, CartItem, Order, OrderItem
from .serializers import ProductSerializer, UserSerializer, CartItemSerializer, OrderSerializer

# ==========================================
# USER ENDPOINTS (Unchanged)
# ==========================================
@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'], 
            email=data['email'],
            password=make_password(data['password']) 
        )
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except:
        message = {'detail': 'A user with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

# ==========================================
# PRODUCT ENDPOINTS (Unchanged)
# ==========================================

@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_staff:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    if not request.user.is_staff:
        return Response({'detail': 'Not authorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
# ==========================================
# NEW: CART ENDPOINTS
# ==========================================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_cart(request):
    user = request.user

    if request.method == 'GET':
        cart_items = CartItem.objects.filter(user=user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Expects {"product_id": 1, "quantity": 1} from React
        product_id = request.data.get('product_id')
        qty = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if item is already in cart, if so, just increase quantity
        cart_item, created = CartItem.objects.get_or_create(user=user, product=product)
        if not created:
            cart_item.quantity += int(qty)
            cart_item.save()
        else:
            cart_item.quantity = int(qty)
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_cart_item(request, pk):
    try:
        cart_item = CartItem.objects.get(id=pk, user=request.user)
        cart_item.delete()
        return Response({'detail': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)
    except CartItem.DoesNotExist:
        return Response({'detail': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

        # ==========================================
# NEW: ORDER & CHECKOUT ENDPOINTS
# ==========================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic # Prevents partial saves if an error occurs during checkout
def checkout(request):
    user = request.user
    cart_items = CartItem.objects.filter(user=user)

    if len(cart_items) == 0:
        return Response({'detail': 'Your cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    shipping_address = request.data.get('shipping_address')
    if not shipping_address:
        return Response({'detail': 'Shipping address is required'}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Calculate Grand Total
    total_amount = sum(item.product.price * item.quantity for item in cart_items)

    # 2. Create the Order Header
    order = Order.objects.create(
        user=user,
        total_amount=total_amount,
        shipping_address=shipping_address
    )

    # 3. Create the Order Items (Receipt Details)
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price_at_purchase=item.product.price # Locks in the historical price!
        )

    # 4. Wipe the user's cart clean
    cart_items.delete()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)