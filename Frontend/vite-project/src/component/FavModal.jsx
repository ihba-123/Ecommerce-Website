import React, { useContext } from "react";
import { Heart, X, ShoppingCart, Trash2, Star } from "lucide-react";
import { ContextApi } from "../context/ContextApi";

const FavModal = ({ showModal, setShowModal }) => {
  const { data, loading, favorites, toggleFavorite } = useContext(ContextApi);

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
    );
  }

  const favoriteProducts = data.filter((item) => favorites.includes(item.id));

  const handleBuyNow = (item) => {
    console.log("Buying now:", item.name);
  };

  const deleteCart = (productId) => {
    toggleFavorite(productId);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-200 rounded-3xl shadow-2xs  hover:shadow-6xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex  justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-500 fill-current" />
                My Favorites ({favorites.length})
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-300 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6  text-gray-600 cursor-pointer" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500 mb-2">No favorites yet</p>
                  <p className="text-gray-400">
                    Start adding products to your favorites!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favoriteProducts.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100  shadow-lg hover:shadow-xl transform transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(item.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-600 ml-1">
                              ({item.rating})
                            </span>
                          </div>
                          <p className="text-lg font-bold text-purple-600 mb-3">
                            ${item.price}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBuyNow(item)}
                              className="cursor-pointer flex-1 bg-gradient-to-r from-gray-900 via-black to-gray-900 hover:from-gray-700 hover:via-gray-500 hover:to-white hover:text-black text-white px-3 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium shadow-lg hover:shadow-xl"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Buy Now
                            </button>
                            <button
                              onClick={() => deleteCart(item.id)}
                              className="bg-red-100 cursor-pointer hover:bg-red-200 text-red-600 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4" />
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
  );
};

export default FavModal;
