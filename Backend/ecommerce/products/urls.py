from django.urls import path
from .views import (
    ProductListCreateView,
    ProductDetailView,
    ProductUpdateView,
    ProductDeleteView,
    FavrouiteItemListView,
    FavrouiteItemDeleteView,
    CategoryItems,
    CategoryView
)
    
urlpatterns = [
    # List all products or create new one
    path('product-list/', ProductListCreateView.as_view(), name='product-list-create'),

    # Retrieve, update, delete a specific product by ID
    path('product-detail/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('product-update/<int:id>/', ProductUpdateView.as_view(), name='product-update'),
    path('product-delete/<int:id>/', ProductDeleteView.as_view(), name='product-delete'),
    path('favorites/', FavrouiteItemListView.as_view(), name='favorite-list-create'),
    path('favorites/<int:product_id>/', FavrouiteItemDeleteView.as_view(), name='favorite-delete'),
    path('category/', CategoryView.as_view(), name='category-items'),
    path('category/<str:category_name>/', CategoryItems.as_view(), name='category-items'),


]
