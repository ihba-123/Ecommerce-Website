import React from 'react'

const Skeleton = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md animate-pulse"
          >
            {/* Skeleton Image */}
            <div className="aspect-square bg-gray-200"></div>
            {/* Skeleton Content */}
            <div className="p-4">
              {/* Skeleton Title */}
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              {/* Skeleton Price */}
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              {/* Skeleton Buttons */}
              <div className="flex gap-2">
                <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
                <div className="h-9 bg-gray-200 rounded-lg w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default Skeleton