from django.urls import path
from . import views

urlpatterns = [
    # ==========================================
    # USER ROUTES
    # ==========================================
    path('users/register/', views.register_user, name='register'),
    path('users/profile/', views.get_user_profile, name='user-profile'),

    # ==========================================
    # PRODUCT ROUTES
    # ==========================================
    path('products/', views.product_list, name='product-list'),
    path('products/<int:pk>/', views.product_detail, name='product-detail'),

    # ==========================================
    # NEW: CART ROUTES
    # ==========================================
    # GET: List user's cart | POST: Add item to cart
    path('cart/', views.manage_cart, name='manage-cart'),
    # DELETE: Remove specific item from cart
    path('cart/<int:pk>/', views.delete_cart_item, name='delete-cart-item'),

    # ==========================================
    # NEW: ORDER ROUTES
    # ==========================================
    # GET: List all orders (Admin sees all, User sees their own)
    path('orders/', views.get_orders, name='get-orders'),
    # POST: Finalize checkout, lock prices, wipe cart
    path('orders/checkout/', views.checkout, name='checkout'),
    path('orders/<int:pk>/status/', views.update_order_status, name='update-order-status'),
] 