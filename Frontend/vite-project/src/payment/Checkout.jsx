// Checkout.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// Load Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ createOrderUrl, createPaymentIntentUrl }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleBuyClick() {
    setMessage(null);
    setLoading(true);

    try {
      // 1) Create order
      const orderResp = await axios.post(createOrderUrl, {});
      const orderData = orderResp.data;
      const orderId = orderData.order_id ?? orderData.id;

      // 2) Create PaymentIntent
      const piResp = await axios.post(createPaymentIntentUrl, { order_id: orderId });
      const { clientSecret } = piResp.data;

      // 3) Collect card + confirm
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not loaded");

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: orderData.user || "Customer",
            email: orderData.user_email || "",
          },
        },
      });

      if (confirmResult.error) {
        setMessage(`❌ Payment failed: ${confirmResult.error.message}`);
      } else if (confirmResult.paymentIntent?.status === "succeeded") {
        setMessage("✅ Payment successful! Redirecting to dashboard...");
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
          window.location.reload();
        }, 2000);
      } else {
        setMessage("⏳ Payment processing...");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
    <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
      Complete Your Payment
    </h2>

    <div className="w-full border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "18px",
              color: "#32325d",
              fontWeight: 500,
              letterSpacing: "0.5px",
              "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#e53e3e" },
          },
        }}
      />
    </div>

    <button
      onClick={handleBuyClick}
      disabled={!stripe || loading}
      className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition text-lg"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>

    {message && (
      <div className="mt-6 text-center text-gray-700 font-medium">
        {message}
      </div>
    )}

    {/* Optional: Close button top-right */}
    <button
      onClick={() => window.location.reload()}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
    >
      &times;
    </button>
  </div>
</div>


  );
}

export default function CheckoutWrapper() {
  const createOrderUrl = "/orders/create/";
  const createPaymentIntentUrl = "/payment/create-intent/";

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        createOrderUrl={createOrderUrl}
        createPaymentIntentUrl={createPaymentIntentUrl}
      />
    </Elements>
  );
}
