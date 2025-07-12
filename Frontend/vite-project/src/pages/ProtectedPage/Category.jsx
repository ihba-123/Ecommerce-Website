import React, { useContext, useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { ContextApi } from '../../context/ContextApi';
import { useNavigate } from 'react-router-dom';

const Category = () => {
const {categories, authentication} = useContext(ContextApi)
const navigate = useNavigate()

const HandleItems = (category)=>{
  if (authentication){
    navigate(`/dashboard/category/${category.name}`)
  }else{
    navigate(`/category/${category.name}`)
  }
}

  return (
    <div className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Discover amazing deals across all categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <div key={category.id}
            onClick={()=>HandleItems(category)}
             className="group cursor-pointer relative">
              {/* Trending Badge (optional, if you have trending field) */}
              {category.trending && (
                <div className="absolute -top-2 -right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  HOT
                </div>
              )}

              {/* Category Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                {/* Image */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={`http://localhost:8000${category.image}`}
                    alt={category?.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                    {category?.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
