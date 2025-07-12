from django.contrib import admin
from .models import ProductModel , ProductImage ,FavouriteProduct ,Category

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

@admin.register(FavouriteProduct)
class PersonAdmin(admin.ModelAdmin):
  list_display = [
    'user',
    'product'
  ]

@admin.register(Category)
class PersonAdmin(admin.ModelAdmin):
  list_display = [
    'name',
    'image',
    'trending',
  ]