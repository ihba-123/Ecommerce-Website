from django.contrib import admin
from .models import Order, OrderItems

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_price', 'created_at']
    list_filter = ['status']
    search_fields = ['user__username', 'id']
    ordering = ['-created_at']

@admin.register(OrderItems)
class OrderItemsAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'quantity', 'price']
    search_fields = ['product__name', 'order__id']
