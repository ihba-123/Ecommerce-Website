import { useState, useEffect, useRef } from "react"
import { FaSearch } from "react-icons/fa"
import { X, Clock, TrendingUp } from "lucide-react"
import axiosInstance from "../api/axiosInstance"
import Spinner from "./ui/Spinner"
import { useLocation, useNavigate } from "react-router-dom"

const FuzzySearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState([]) // Dynamic recent searches
  const location = useLocation()
  const navigate = useNavigate()
  const debounceTimeout = useRef(null)
  const inputRef = useRef(null)

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches)
        setRecentSearches(parsed)
      } catch (error) {
        console.error("Error parsing recent searches:", error)
        setRecentSearches([])
      }
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (query) => {
    if (!query.trim()) return

    setRecentSearches((prevSearches) => {
      // Remove the query if it already exists to avoid duplicates
      const filteredSearches = prevSearches.filter((search) => search.toLowerCase() !== query.toLowerCase())

      // Add the new search at the beginning
      const newSearches = [query, ...filteredSearches].slice(0, 5) // Keep only last 5 searches

      // Save to localStorage
      localStorage.setItem("recentSearches", JSON.stringify(newSearches))

      return newSearches
    })
  }

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  // Remove a specific recent search
  const removeRecentSearch = (searchToRemove) => {
    setRecentSearches((prevSearches) => {
      const filteredSearches = prevSearches.filter((search) => search !== searchToRemove)
      localStorage.setItem("recentSearches", JSON.stringify(filteredSearches))
      return filteredSearches
    })
  }

  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceTimeout.current)
      debounceTimeout.current = setTimeout(() => func(...args), delay)
    }
  }

  // 🔍 Fetch products from API
  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get(`/product-list/?search=${encodeURIComponent(query)}`)
      setSearchResults(response.data)

      // Save successful search to recent searches
      if (response.data.length > 0) {
        saveRecentSearch(query)
      }
    } catch (err) {
      setError("Failed to load results. Please try again.")
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = debounce((query) => {
    fetchSearchResults(query)
  }, 300)

  useEffect(() => {
    return () => clearTimeout(debounceTimeout.current)
  }, [])

  // ✅ This handles correct redirection
  const redirectToProduct = (productId) => {
    const isInDashboard = location.pathname.startsWith("/dashboard")
    if (isInDashboard) {
      navigate(`/dashboard/product-detail/${productId}`)
    } else {
      navigate(`/product-detail/${productId}`)
    }

    // Save the current search query when user clicks on a product
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery)
    }

    setSearchQuery("")
    setSearchResults([])
    setIsFocused(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setError(null)
    inputRef.current?.focus()
  }

  const handleRecentSearch = (query) => {
    setSearchQuery(query)
    handleSearch(query)
    setIsFocused(false)
  }

  // Handle form submission (when user presses Enter)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery)
      handleSearch(searchQuery)
    }
  }

  const showDropdown =
    isFocused &&
    (isLoading ||
      error ||
      searchResults.length > 0 ||
      (searchQuery && !isLoading && !error) ||
      (!searchQuery && recentSearches.length > 0))

  return (
    <form onSubmit={handleSubmit} className="relative w-full mx-auto">
      {/* Search Input Container */}
      <div className="relative group">
        {/* Background Glow Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-xl transition-all duration-300 ${isFocused ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
        ></div>

        {/* Main Input Container */}
        <div
          className={`relative bg-white rounded-xl border transition-all duration-300 shadow-sm ${isFocused ? "border-gray-300 shadow-lg ring-2 ring-gray-100/50" : "border-gray-200 hover:border-gray-300 hover:shadow-md"}`}
        >
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <FaSearch
              className={`w-3.5 h-3.5 transition-colors duration-300 ${isFocused ? "text-gray-600" : "text-gray-400"}`}
            />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2.5 bg-transparent rounded-xl focus:outline-none text-sm placeholder-gray-400 text-gray-700 font-medium"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            >
              <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
            </button>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search Dropdown Results */}
      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-2 z-[60]">
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-2xl rounded-xl overflow-hidden transition-all duration-300 animate-in slide-in-from-top-2">
            {/* Recent Searches (when no query) */}
            {!searchQuery && !isLoading && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </div>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    Clear All
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center group">
                    <button
                      type="button"
                      onClick={() => handleRecentSearch(search)}
                      className="flex-1 flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-200 rounded-lg"
                    >
                      <div className="w-7 h-7 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <span className="font-medium flex-1 text-left">{search}</span>
                      <TrendingUp className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRecentSearch(search)
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all duration-200 mr-2"
                    >
                      <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="p-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="relative">
                    <Spinner />
                  </div>
                  <span className="font-medium">Searching products...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span className="text-sm text-red-600 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && searchResults.length === 0 && searchQuery && (
              <div className="p-3">
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FaSearch className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">No results found</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching with different keywords</p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && !error && searchResults.length > 0 && (
              <div className="max-h-72 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <FaSearch className="w-3 h-3" />
                    Products ({searchResults.length})
                  </div>
                  {searchResults.map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => redirectToProduct(product.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-200 rounded-lg group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-xs font-bold text-gray-600">{product.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">in {product.category}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-5 h-5 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="w-1.5 h-1.5 border-t border-r border-gray-500 rotate-45"></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-in {
          animation: animate-in 0.2s ease-out forwards;
        }
        
        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.3s ease-out forwards;
        }
        
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </form>
  )
}

export default FuzzySearch
