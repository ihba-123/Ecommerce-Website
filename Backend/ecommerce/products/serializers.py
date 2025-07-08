from rest_framework import serializers
from .models import ProductModel , ProductImage ,FavouriteProduct

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'
        
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True, source='productimage_set')
    class Meta:
        model = ProductModel
        fields = '__all__'

class FavrouiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavouriteProduct
        fields = ['id' ,'product']
        
