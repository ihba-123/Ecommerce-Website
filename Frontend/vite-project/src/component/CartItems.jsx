import React from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";

const CartItem = () => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Shopping Cart (2)</h3>
          <button className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {/* Empty Cart */}
          {/* <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <ShoppingCart className="w-16 h-16 mb-4" />
            <p className="text-lg">Your cart is empty</p>
            <p className="text-sm">Add some products to get started</p>
          </div> */}

          {/* Cart Items */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-200">
            <img
              src="https://via.placeholder.com/64"
              alt="Product"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">Sample Product</h4>
              <p className="text-blue-600 font-bold">$99.99</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">1</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button className="p-1 text-red-500 hover:bg-red-50 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">$99.99</span>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
