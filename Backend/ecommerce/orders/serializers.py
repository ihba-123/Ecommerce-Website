from rest_framework import serializers
from  products.serializers import ProductSerializer
from products.models import ProductModel
from .models import OrderItems ,Order

class OrderItemSerializers(serializers.ModelSerializer):
  product = ProductSerializer(read_only= True)
  product_id = serializers.PrimaryKeyRelatedField(
      queryset=ProductModel.objects.all(),
      source='product',
      write_only=True
  )

  class Meta:
    model = OrderItems
    fields = ['id', 'product', 'product_id', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
  items = OrderItemSerializers(many=True , read_only =  True)
  total_price = serializers.DecimalField(
      max_digits=10,
      decimal_places=2,
      read_only = True
  )

  class Meta:
    model = Order
    fields = ['id','user', 'items','total_price', 'status','payment_status', 'created_at', 'updated_at']