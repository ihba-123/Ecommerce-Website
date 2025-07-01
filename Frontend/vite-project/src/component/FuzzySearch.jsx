import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import Spinner from './ui/Spinner';
import { useLocation, useNavigate } from "react-router-dom";

const FuzzySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const debounceTimeout = useRef(null);

  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => func(...args), delay);
    };
  };

  // 🔍 Fetch products from API
  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/product-list/?search=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to load results. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = debounce((query) => {
    fetchSearchResults(query);
  }, 300);

  useEffect(() => {
    return () => clearTimeout(debounceTimeout.current);
  }, []);

  // ✅ This handles correct redirection
  const redirectToProduct = (productId) => {
    const isInDashboard = location.pathname.startsWith("/dashboard");
    if (isInDashboard) {
      navigate(`/dashboard/product-detail/${productId}`);
    } else {
      navigate(`/product-detail/${productId}`);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search for products..."
          className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm transition"
        />
        <div className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 border-l border-gray-300 pl-2">
          <FaSearch className="w-4 h-4" />
        </div>
      </div>

      {/* Search Dropdown Results */}
      {(isLoading || error || searchResults.length > 0 || (searchQuery && !isLoading && !error)) && (
        <div className="absolute top-full left-0 w-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-lg mt-2 z-[50] max-h-64 overflow-y-auto transition-all duration-200">
          {isLoading && (
            <div className="px-4 py-2 text-sm text-gray-500 flex items-center">
              <Spinner />
              <span className="ml-2">Loading...</span>
            </div>
          )}
          {error && (
            <div className="px-4 py-2 text-sm text-red-500">{error}</div>
          )}
          {!isLoading && !error && searchResults.length === 0 && searchQuery && (
            <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
          )}
          {!isLoading && !error && searchResults.length > 0 && (
            searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => redirectToProduct(product.id)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50 transition cursor-pointer"
              >
                {product.name} ({product.category})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FuzzySearch;
