from django.urls import path
from . import views

urlpatterns = [
    path('orders/', views.UserOrderListView.as_view(), name='user-orders'),
    path('orders/create/', views.CreateOrderView.as_view(), name='order-create'),
    path('orders/<int:id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('admin/orders/', views.AdminOrderListView.as_view(), name='admin-orders'),
    path('payment/create-intent/', views.CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('payment/webhook/', views.StripeWebhookView.as_view(), name='stripe-webhook'),
]
