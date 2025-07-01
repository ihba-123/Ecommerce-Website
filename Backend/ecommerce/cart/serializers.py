from rest_framework import serializers
from .models import Cart, CartItems
from products.models import ProductModel
from products.serializers import ProductSerializer

class CartItemsSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # shows full product details
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductModel.objects.all(),
        source='product',
        write_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItems
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return obj.quantity * obj.product.price

  

class CartSerializer(serializers.ModelSerializer):
    items = CartItemsSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'subtotal', 'total', 'created_at', 'updated_at']

    def get_subtotal(self, obj):
        return sum(item.quantity * item.product.price for item in obj.items.all())

    def get_total(self, obj):
        return self.get_subtotal(obj)
