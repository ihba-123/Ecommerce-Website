import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* 404 Number with Simple Animation */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-white animate-pulse select-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-xl md:text-2xl font-medium text-gray-400 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.location.href = '/'}
            className="group px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>

          <button
            onClick={handleGoBack}
            className="group px-6 py-3 border border-gray-600 text-gray-400 font-medium hover:bg-gray-600 hover:text-white transition-all duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;