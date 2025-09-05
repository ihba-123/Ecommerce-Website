"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ContextApi } from "../context/ContextApi"
import Skeleton from "../component/ui/Skeleton"
import Favorites from "../component/Favorites"

const ProductPage = () => {
  const navigate = useNavigate()
  const { data, loading, favorites, toggleFavorite, authentication, addToCart } = useContext(ContextApi)

  const CartAuth = async ({ productId }) => {
    if (!authentication) {
      navigate("/login")
      return
    }
    if (!productId) {
      console.error("productId is undefined")
      return
    }
    try {
      await addToCart(productId, 1)
      console.log("Item added to cart:", productId)
    } catch (err) {
      console.error("Failed to add item to cart:", err)
    }
  }

  if (loading || !data || data.length === 0) return <Skeleton />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Discover Our Collection
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-gray-400 via-gray-700 to-gray-400 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Find products that match your vibe and style with our curated selection.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {data.map((product, index) => {
            const isFavorite = favorites.includes(product.id)
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-200 group">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Favorite Button */}
                  {authentication && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200">
                        <Favorites isFavorite={isFavorite} onToggle={() => toggleFavorite(product.id)} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6">
                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 mb-2 hover:text-gray-800 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => CartAuth({ productId: product.id })}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-medium py-2.5 px-3 sm:px-4 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                        />
                      </svg>
                      <span className="hidden xs:inline">Add to Cart</span>
                      <span className="xs:hidden">Add</span>
                    </button>

                      <Link
                        to={!authentication ? `/product-detail/${product.id}` : `product-detail/${product.id}`}
                        className="flex items-center justify-center px-3 sm:px-4 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.99] min-w-[60px] sm:min-w-[70px]"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="hidden sm:inline ml-1.5">View</span>
                      </Link>
                  </div>
                </div>

                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-100/20 via-white/20 to-gray-100/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            )
          })}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <span className="text-sm font-medium">End of Collection</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (min-width: 475px) {
          .xs\\:inline { display: inline; }
          .xs\\:hidden { display: none; }
        }
        
        @media (max-width: 474px) {
          .xs\\:inline { display: none; }
          .xs\\:hidden { display: inline; }
        }
      `}</style>
    </div>
  )
}

export default ProductPage
