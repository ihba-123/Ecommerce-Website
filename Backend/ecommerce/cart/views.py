from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItems
from .serializers import CartItemsSerializer
from products.models import ProductModel


# View Cart
class CartView(generics.RetrieveAPIView):
    serializer_class = CartItemsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = CartItems.objects.filter(cart=cart)
        serializer = CartItemsSerializer(items, many=True)
        return Response(serializer.data)


# Add to Cart (Fixed version)
class AddToCartView(generics.CreateAPIView):
    serializer_class = CartItemsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if quantity < 1:
            return Response({'error': 'Quantity must be greater than 0'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(ProductModel, id=product_id)
        if product.stock < quantity:
            return Response({'error': 'Product is out of stock'}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        # Check if item already exists (even if duplicated)
        existing_items = CartItems.objects.filter(cart=cart, product=product)

        if existing_items.exists():
            first_item = existing_items.first()
            total_quantity = first_item.quantity + quantity

            if total_quantity > product.stock:
                return Response({'error': 'Product is out of stock'}, status=status.HTTP_400_BAD_REQUEST)

            first_item.quantity = total_quantity
            first_item.save()

            # Remove duplicates
            existing_items.exclude(id=first_item.id).delete()

            serializer = CartItemsSerializer(first_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            cart_item = CartItems.objects.create(cart=cart, product=product, quantity=quantity)
            serializer = CartItemsSerializer(cart_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


# Update Cart Item
class UpdateCartView(generics.UpdateAPIView):
    serializer_class = CartItemsSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'item_id'

    def get_queryset(self):
        return CartItems.objects.filter(cart__user=self.request.user)

    def update(self, request, *args, **kwargs):
        cart_item = self.get_object()
        quantity = int(request.data.get('quantity', 1))

        if quantity < 1:
            return Response({'error': 'Quantity must be greater than 0'}, status=status.HTTP_400_BAD_REQUEST)

        if quantity > cart_item.product.stock:
            return Response({'error': 'Product is out of stock'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartItemsSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Remove Cart Item
class RemoveCartItemView(generics.DestroyAPIView):
    serializer_class = CartItemsSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'item_id'

    def get_queryset(self):
        return CartItems.objects.filter(cart__user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        cart_item = self.get_object()
        cart_item.delete()
        return Response({'message': 'ok'}, status=status.HTTP_200_OK)
