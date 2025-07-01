from django.contrib import admin
from .models import Cart , CartItems
# Register your models here.
@admin.register(Cart)
class UserAdmin(admin.ModelAdmin):
  list_display = ('user', 'create_at','update_at')

@admin.register(CartItems)
class UserAdmin(admin.ModelAdmin):
  list_display = ('cart', 'product', 'quantity', 'create_at','update_at')