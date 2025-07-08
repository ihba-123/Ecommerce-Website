import React, { useContext, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { ContextApi } from "../context/ContextApi";

const CartItem = ({ cartBox, setCartBox }) => {
  const [quantity, setQuantity] = useState(1);
  const { cart, totalPrice, deleteCart, updateCart } = useContext(ContextApi);
  const handleClose = () => setCartBox(false);

  const handleDelete = async (item_id) => {
    try {
      await deleteCart(item_id);
      console.log("Delete");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        cartBox ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Cart Item */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out"
            >
              <img
                src={`http://localhost:8000${item.product.image}`}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">
                  {item.product.name}
                </h3>
                <p className="text-sm font-semibold text-gray-600">
                  In Stock:{" "}
                  <span className="text-green-600">{item.product.stock}</span>
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  ${item.product.price}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Trash2 onClick={() => handleDelete(item.id)} size={16} />
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCart(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCart(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span className="text-gray-950">${totalPrice}</span>
        </div>
        <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-gray-700 transition-colors duration-200">
          Proceed to Checkout
        </button>
        <button
          onClick={handleClose}
          className="w-full bg-gray-100 cursor-pointer text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartItem;
