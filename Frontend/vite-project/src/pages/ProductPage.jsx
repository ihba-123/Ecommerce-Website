  import React, { useContext, useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { ContextApi } from '../context/ContextApi';
  import Skeleton from '../component/ui/skeleton';
  import Favorites from '../component/Favorites';

  const ProductPage = () => {
    const navigate = useNavigate();
    const { data, loading ,toggleFavorite , favorites ,authentication , CartItem } = useContext(ContextApi);

    const CartAuth = ()=>{
      if(!authentication){
        navigate('/login')
      }
    }


    if (loading) return <Skeleton />;

    return (
      <div className="min-h-screen bg-white py-6 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              🛍 Discover Our Collection
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              Find products that match your vibe and style.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {data.map((product, index) => {
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
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Favorite Button */}
                {authentication ?(<Favorites
                 isFavorite={isFavorite}
                 onToggle={() => toggleFavorite(product.id)
                  
                 }/>):(
                  null
                 )}

                  {/* Info */}
                  <div className="p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-900 mb-3">
                      ${product.price}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 text-center">
                      <button onClick={CartAuth} className="flex-1 cursor-pointer bg-black  text-white text-xs md:text-sm py-3 px-3 rounded-md active:scale-95">
                        Add to Cart
                      </button>
                      {!authentication?(<Link
                        to={`/product-detail/${product.id}`}
                        className="px-3 border border-gray-300 text-gray-600 py-2 rounded-md text-xs md:text-sm active:scale-95"
                      >
                        View
                      </Link>):(
                        <Link
                        to={`product-detail/${product.id}`}
                        className="px-3 border border-gray-300 text-gray-600 py-2 rounded-md text-xs md:text-sm active:scale-95"
                      >
                        View
                      </Link>
                      )}
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

  export default ProductPage;
