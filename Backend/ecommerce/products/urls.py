from django.urls import path
from .views import (
    ProductListCreateView,
    ProductDetailView,
    ProductUpdateView,
    ProductDeleteView,
)
    
urlpatterns = [
    # List all products or create new one
    path('product-list/', ProductListCreateView.as_view(), name='product-list-create'),

    # Retrieve, update, delete a specific product by ID
    path('product-detail/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('product-update/<int:id>/', ProductUpdateView.as_view(), name='product-update'),
    path('product-delete/<int:id>/', ProductDeleteView.as_view(), name='product-delete'),
]
