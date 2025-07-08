from django.shortcuts import render

# Create your views here.
from .serializers import ProductSerializer ,FavrouiteSerializer
from .models import ProductModel ,FavouriteProduct
from rest_framework.response import Response
from django.http import Http404
from rest_framework import generics,status, permissions
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


class FavrouiteItemListView(generics.ListCreateAPIView):
    serializer_class = FavrouiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavouriteProduct.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        product_id = request.data.get("product")

        if not product_id:
            return Response({"detail": "Product ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent duplicate
        if FavouriteProduct.objects.filter(user=user, product_id=product_id).exists():
            return Response({"detail": "Already favorited."}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FavrouiteItemDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        product_id = self.kwargs['product_id']
        try:
            return FavouriteProduct.objects.get(user=user, product_id=product_id)
        except FavouriteProduct.DoesNotExist:
            raise Http404