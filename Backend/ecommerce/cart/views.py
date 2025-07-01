from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Cart, CartItems
from .serializers import CartItemsSerializer
from products.models import ProductModel


from django.shortcuts import get_object_or_404
# Create your views here.


class CartView(generics.RetrieveAPIView):
    serializer_class = CartItemsSerializer  # optional, only used if viewing a single item
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = CartItems.objects.filter(cart=cart)
        serializer = CartItemsSerializer(items, many=True)
        return Response(serializer.data)



#Add  to the  cart
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
        cart_item, created = CartItems.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return Response({'error': 'Product is out of stock'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = new_quantity
            cart_item.save()

        serializer = CartItemsSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



#Update View
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


  #Removing the Cart Items

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
    

    
    
    

