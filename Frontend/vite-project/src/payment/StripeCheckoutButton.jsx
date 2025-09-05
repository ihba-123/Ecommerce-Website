import React, { useState } from "react";
import CheckoutWrapper from "./Checkout"; // your CheckoutWrapper component

export default function StripeCheckoutButton({ label = "Buy Now" }) {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowCheckout(true)}
        className="w-full bg-gray-950 cursor-pointer text-white py-3.5 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        {label}
      </button>

      {showCheckout && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              width: "90%",
              maxWidth: 500,
              position: "relative"
            }}
          >
            <button
              onClick={() => setShowCheckout(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: 18,
                cursor: "pointer"
              }}
            >
              &times;
            </button>

            <CheckoutWrapper />
          </div>
        </div>
      )}
    </>
  );
}
