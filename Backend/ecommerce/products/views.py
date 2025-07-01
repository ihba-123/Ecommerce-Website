from django.shortcuts import render

# Create your views here.
from .serializers import ProductSerializer
from .models import ProductModel
from rest_framework.response import Response
from rest_framework import generics, permissions
from django.db.models import Q # For complex Query with OR conditions
class IsAdminStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

# Product list and create view
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = ProductModel.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminStaff()]
        return [permissions.AllowAny()]
    
    #For search functionality
    def get_queryset(self):
        queryset = ProductModel.objects.all()
        search_query = self.request.query_params.get('search' , None)
        if search_query:
            queryset = queryset.filter(Q(name__icontains=search_query) | Q(description__icontains=search_query))
        return queryset


# Product detail view (Read by ID)
class ProductDetailView(generics.RetrieveAPIView):
    queryset = ProductModel.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny]


# Product update view
class ProductUpdateView(generics.UpdateAPIView):
    queryset = ProductModel.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminStaff()]

# Product delete view
class ProductDeleteView(generics.DestroyAPIView):
    queryset = ProductModel.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminStaff()]
