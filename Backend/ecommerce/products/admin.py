from django.contrib import admin
from .models import ProductModel , ProductImage

# Register your models here.

@admin.register(ProductModel)
class PersonAdmin(admin.ModelAdmin):
  list_display = [
    'name',
    'description',
    'price',
    'stock',
    'image',
    'category',
    'created_at',
    'updated_at',
  ]

@admin.register(ProductImage)
class PersonAdmin(admin.ModelAdmin):
  list_display = [
    'product',
    'image',
  ]
