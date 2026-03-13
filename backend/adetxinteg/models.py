from django.db import models
from django.contrib.auth.models import User # <-- REQUIRED: Imports Django's built-in User table

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    specs = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default="In Stock")
    
    # DecimalField is crucial for currency so we don't get floating-point math errors
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    
    # We store the raw number, frontend handles the "Low Stock" badge logic
    stock = models.IntegerField(default=0)
    
    # Always good practice to know when a device was added to the database
    created_at = models.DateTimeField(auto_now_add=True)

    # ADDED: The Image Field
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} - ₱{self.price}"

# ==========================================
# NEW TABLES FOR KONEKTA ERD
# ==========================================

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} - {self.user.username}'s Cart"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    
    # Lifecycle tracking (e.g., Pending, Processing, Shipped, Delivered)
    status = models.CharField(max_length=50, default="Pending")

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    # related_name='items' lets us easily grab all items for an order in Django REST
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    
    # CRUCIAL ERD LOGIC: Locks in the price. If the main Product price drops next year, 
    # this historical receipt won't accidentally change.
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} (Order #{self.order.id})"