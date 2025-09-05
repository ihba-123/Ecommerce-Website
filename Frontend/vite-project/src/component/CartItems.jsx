import { useContext } from "react"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { ContextApi } from "../context/ContextApi"
import StripeCheckoutButton from "../payment/StripeCheckoutButton"

const CartItem = ({ cartBox, setCartBox }) => {
  const { cart, totalPrice, deleteCart, updateCart } = useContext(ContextApi)
  const handleClose = () => setCartBox(false)

  const handleDelete = async (item_id) => {
    try {
      await deleteCart(item_id)
      console.log("Item deleted:", item_id)
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-l-2xl flex flex-col border-l border-gray-100/80`}
      style={{ transform: cartBox ? "translateX(0)" : "translateX(100%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingCart size={24} className="text-gray-700" />
          Shopping Cart
        </h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-800"
        >
          <X size={20} />
          <span className="sr-only">Close cart</span>
        </button>
      </div>

      {/* Cart Items - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <ShoppingCart size={48} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm mt-2">Add some amazing products to get started!</p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <img
                src={`http://localhost:8000${item.product.image}`}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  In Stock: <span className="text-green-600 font-medium">{item.product.stock}</span>
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">${item.product.price}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  <Trash2 size={18} />
                  <span className="sr-only">Remove item</span>
                </button>
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    onClick={() => updateCart(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-full text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={14} />
                    <span className="sr-only">Decrease quantity</span>
                  </button>
                  <span className="px-2 font-medium text-gray-900 min-w-[30px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCart(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span className="sr-only">Increase quantity</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-6 space-y-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center text-xl font-bold">
          <span className="text-gray-800">Total:</span>
          <span className="text-gray-950">${totalPrice}</span>
        </div>
        <StripeCheckoutButton  label="Buy Now" />
        <button
          onClick={handleClose}
          className="w-full bg-gray-100 cursor-pointer text-gray-700 py-3.5 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default CartItem
