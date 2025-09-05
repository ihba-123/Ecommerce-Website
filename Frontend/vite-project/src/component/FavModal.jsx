"use client"

import { useContext } from "react"
import { Heart, X, ShoppingCart, Trash2, Star } from "lucide-react"
import { ContextApi } from "../context/ContextApi"

const FavModal = ({ showModal, setShowModal }) => {
  const { data, loading, favorites, toggleFavorite } = useContext(ContextApi)

  // Show loading state while data is fetching
  if (loading) {
    return (
      showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <p className="text-lg font-semibold text-gray-700">Loading favorites...</p>
          </div>
        </div>
      )
    )
  }

  const favoriteProducts = data.filter((item) => favorites.includes(item.id))

  const handleBuyNow = (item) => {
    console.log("Buying now:", item.name)
    // Add actual buy now logic here
  }

  const deleteFavoriteItem = (productId) => {
    toggleFavorite(productId)
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-100/80">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-6 h-6 text-gray-700 fill-current" />
                My Favorites ({favorites.length})
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-800"
              >
                <X size={20} />
                <span className="sr-only">Close favorites modal</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {favoriteProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-500">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-medium mb-2">No favorites yet</p>
                  <p className="text-sm">Start adding products to your favorites!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favoriteProducts.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl flex-shrink-0 border border-gray-100"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(item.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-600 ml-1">({item.rating})</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900 mb-3">${item.price}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBuyNow(item)}
                              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-md hover:shadow-lg active:scale-[0.98]"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Buy Now
                            </button>
                            <button
                              onClick={() => deleteFavoriteItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="sr-only">Remove from favorites</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FavModal
