from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Order, OrderItems
from .serializers import OrderSerializer
from cart.models import Cart
import stripe  
from decouple import config
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

print(config)
# ✅ FIXED TYPO
stripe.api_key = config('STRIPE_SECRET_KEY')  # was api_ley
stripe_webhook_secret = config('STRIPE_WEBHOOK_SECRET')

print(config('STRIPE_SECRET_KEY'))  # Should print sk_test_...
print(config('STRIPE_WEBHOOK_SECRET'))

class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    
    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)

        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        for item in cart.items.all():
            if item.product.stock < item.quantity:
                return Response(
                    {'error': f'Product \"{item.product.name}\" is out of stock or insufficient quantity'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        with transaction.atomic():
            total_price = sum(item.quantity * item.product.price for item in cart.items.all())

            order = Order.objects.create(
                user=request.user,
                total_price=total_price,
                status='Pending',
                payment_status='Pending'
            )

            for item in cart.items.all():
                OrderItems.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )
                item.product.stock -= item.quantity
                item.product.save()

            cart.items.all().delete()

            

        serializer = OrderSerializer(order)
        data = serializer.data
        data['order_id'] = order.id
        return Response(data, status=status.HTTP_201_CREATED)


class UserOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class AdminOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = OrderSerializer
    queryset = Order.objects.all().order_by('-created_at')


class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.payment_status != 'Pending':
            return Response({'error': 'Order is not pending for payment'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(order.total_price * 100),
                currency='npr', 
                metadata={'order_id': str(order.id)},
                idempotency_key=f"order_{order.id}_{request.user.id}"
            )
            return Response({
                'clientSecret': intent.client_secret,
                'paymentIntentId': intent.id
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
  def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = stripe_webhook_secret
        if not sig_header:
            return Response({'error': 'Missing Stripe-Signature header'}, status=status.HTTP_400_BAD_REQUEST)
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        event_type = event['type']
        data_object = event['data']['object']
        order_id = data_object.get('metadata', {}).get('order_id')

        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                with transaction.atomic():
                    if event_type == 'payment_intent.succeeded':
                        order.payment_status = 'completed'
                    elif event_type == 'payment_intent.payment_failed':
                        order.payment_status = 'failed'
                    order.save()
            except Order.DoesNotExist:
                pass  # log error in production

        return Response(status=status.HTTP_200_OK)
    
