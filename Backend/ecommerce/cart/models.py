from django.db import models
from account.models import User
from products.models import ProductModel
# Create your models here.

class Cart(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='cart')
  create_at = models.DateTimeField(auto_now_add=True)
  update_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return f"Cart of {self.user.email}"


class CartItems(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE , related_name='items')
    product = models.ForeignKey(ProductModel, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart.user.email}'s cart"