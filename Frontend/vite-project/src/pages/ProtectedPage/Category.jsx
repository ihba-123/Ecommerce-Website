import { useContext } from "react"
import { TrendingUp } from "lucide-react"
import { ContextApi } from "../../context/ContextApi"
import { useNavigate } from "react-router-dom"

const Category = () => {
  const { categories, authentication } = useContext(ContextApi)
  const navigate = useNavigate()

  const HandleItems = (category) => {
    if (authentication) {
      navigate(`/dashboard/category/${category.name}`)
    } else {
      navigate(`/category/${category.name}`)
    }
  }

  return (
    <div className="w-full min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-gray-400 via-gray-700 to-gray-400 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover amazing deals across all categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => HandleItems(category)}
              className="group cursor-pointer relative"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              {/* Trending Badge (optional, if you have trending field) */}
              {category.trending && (
                <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <TrendingUp className="w-3 h-3" />
                  HOT
                </div>
              )}
              {/* Category Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                {/* Image */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {/* Note: Using the original image source from your code. If this is a local path, ensure your setup serves it correctly. */}
                  <img
                    src={`http://localhost:8000${category.image}`}
                    alt={category?.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-gray-700 transition-colors">
                    {category?.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <span className="text-sm font-medium">Explore More</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
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
  )
}

export default Category
