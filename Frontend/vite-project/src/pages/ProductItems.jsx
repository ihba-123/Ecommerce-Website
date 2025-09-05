"use client"

import { useContext, useState, useEffect } from "react"
import { ContextApi } from "../context/ContextApi"
import { useNavigate, useParams } from "react-router-dom"
import StripeCheckoutButton from "../payment/StripeCheckoutButton"

const ProductItems = () => {
  const [mainImage, setMainImage] = useState(null)
  const { data, loading, addToCart, updateCart, cart, authentication } = useContext(ContextApi)
  const { id } = useParams()
  const navigate = useNavigate()

  const product = data.find((item) => item.id === Number.parseInt(id))
  const cartItem = cart.find((item) => item.product.id === product?.id)
  const [localQuantity, setLocalQuantity] = useState(1)

  useEffect(() => {
    if (authentication && cartItem) {
      setLocalQuantity(cartItem.quantity)
    } else {
      setLocalQuantity(1)
    }
  }, [authentication, cartItem])

  const handleAddToCart = async (productId) => {
    if (!authentication) {
      navigate("/login", { replace: true })
      return
    }
    try {
      await addToCart(productId, 1)
    } catch (error) {
      console.log(error)
    }
  }

  const increaseQuantity = () => {
    if (authentication) {
      updateCart(cartItem.id, cartItem.quantity + 1)
    } else {
      setLocalQuantity((q) => q + 1)
    }
  }

  const decreaseQuantity = () => {
    if (authentication) {
      if (cartItem.quantity > 1) updateCart(cartItem.id, cartItem.quantity - 1)
    } else {
      setLocalQuantity((q) => (q > 1 ? q - 1 : 1))
    }
  }

  if (loading || !product)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    )

  const images = product.images || []
  const defaultMainImage = images.length > 0 ? images[0].image : ""

  return (
    <div className="min-h-screen pt-20 pb-8 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Section */}
          <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 sm:w-24">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img.image)}
                  className={`flex-shrink-0 w-20 h-20 object-cover rounded border-2 transition-all duration-200 ${
                    (mainImage || defaultMainImage) === img.image
                      ? "border-gray-900"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  <img
                    src={img.image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>

            {/* Main Image - Fixed dimensions to prevent layout shift */}
            <div className="flex-1 bg-white rounded-lg shadow-sm">
              <div className="w-full h-[500px] flex justify-center items-center p-4">
                <img
                  src={mainImage || defaultMainImage}
                  alt="Main product"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
            <p className="text-sm text-slate-500 mt-2">{product.description}</p>

            <div className="mt-6">
              <p className="text-3xl font-bold text-slate-900">${product.price}</p>
              <p className="text-green-600 text-sm mt-1">
                {product.stock > 0 ? `${product.stock} piece${product.stock > 1 ? "s" : ""} available` : "Out of stock"}
              </p>
            </div>

            {/* Quantity controls */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">Quantity</h3>
              <div className="flex items-center mt-3 gap-3">
                <button
                  onClick={decreaseQuantity}
                  className="w-8 h-8 border border-gray-300 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">
                  {authentication ? (cartItem ? cartItem.quantity : 0) : localQuantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="w-8 h-8 border border-gray-300 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleAddToCart(product.id)}
                className="w-full hover:bg-gray-900 px-4 py-2.5 border border-slate-800 text-slate-900 hover:text-white cursor-pointer rounded-md transition-colors duration-200"
              >
                Add to Cart
              </button>
              {!authentication? (
                <button
                  className="w-full hover:bg-gray-900 px-4 py-2.5 border border-slate-800 text-slate-900 hover:text-white cursor-pointer rounded-md transition-colors duration-200"
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Buy Now
                </button>
              ):(<StripeCheckoutButton  label="Buy Now" />)}
              
            </div>

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900">Product Description</h3>
              <p className="text-sm text-slate-500 mt-2">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <ul className="list-disc mt-4 pl-5 text-sm text-slate-500">
                  {product.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductItems
