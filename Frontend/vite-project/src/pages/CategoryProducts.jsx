import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ContextApi } from "../context/ContextApi";
import axiosInstance from "../api/axiosInstance";
import Favorites from "../component/Favorites";
import Skeleton from "../component/ui/Skeleton";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // Your global context
  const {
    favorites,
    toggleFavorite,
    authentication,
    addToCart,
  } = useContext(ContextApi);

  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`category/${categoryName}/`);
        setCategoryProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  const CartAuth = async ({ productId }) => {
    if (!authentication) {
      navigate("/login");
      return;
    }
    if (!productId) {
      console.error("productId is undefined");
      return;
    }
    try {
      await addToCart(productId, 1);
      console.log("Item added to cart:", productId);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    }
  };

  if (loading) return <Skeleton />;

  if (!categoryProducts.length)
    return (
      <div className="text-center py-10">
        No products found in category "{categoryName}".
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            🛍 Products in "{categoryName}"
          </h2>
          <p className="mt-2 text-gray-500 text-sm sm:text-base">
            Browse products matching your style.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {categoryProducts.map((product, index) => {
            const isFavorite = favorites.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative p-1 md:p-2 lg:p-4"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
                }}
              >
                {/* Image */}
                <div className="aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-lg">
                  <img
                    src={`http://localhost:8000${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Favorite Button */}
                {authentication && (
                  <Favorites
                    isFavorite={isFavorite}
                    onToggle={() => toggleFavorite(product.id)}
                  />
                )}

                {/* Info */}
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm md:text-base font-bold text-gray-900 mb-3">
                    $ {product.price}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 text-center">
                    <button
                      onClick={() => CartAuth({ productId: product.id })}
                      className="flex-1 cursor-pointer bg-black  text-white text-xs md:text-sm py-3 px-3 rounded-md active:scale-95"
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/product-detail/${product.id}`}
                      className="px-3 border border-gray-300 text-gray-600 py-2 rounded-md text-xs md:text-sm active:scale-95"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default CategoryProducts;
