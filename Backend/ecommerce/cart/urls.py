from django.urls import path 
from . import views

urlpatterns = [

  path('cart/' , views.CartView.as_view() , name='cart'),
  path('add-to-cart/' , views.AddToCartView.as_view() , name='add-to-cart'),
  path('update-cart/<int:item_id>/' , views.UpdateCartView.as_view() , name='update-cart'),
  path('remove-from-cart/<int:item_id>/' , views.RemoveCartItemView.as_view() , name='remove-from-cart'),

]
