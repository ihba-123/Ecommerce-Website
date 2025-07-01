import React, { useState, useEffect } from "react";
import Banner1 from "../../assets/Banner2.jpg";
import Banner2 from "../../assets/Banner1.avif";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: Banner1,
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends in fashion",
      cta: "Shop Now",
    },
    {
      image: Banner2,
      title: "Premium Electronics",
      subtitle: "Experience cutting-edge technology",
      cta: "Explore Tech",
    },
    {
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80",
      title: "Home & Lifestyle",
      subtitle: "Transform your living space",
      cta: "Shop Home",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-10 md:py-14">
      <div className="relative w-full rounded-3xl overflow-hidden min-h-[60vh] sm:min-h-[70vh] lg:min-h-[85vh] shadow-lg">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            {/* Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 sm:px-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 sm:p-6 md:p-8 max-w-md text-center shadow-xl">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 animate-fade-in-up">
                  {slide.title}
                </h1>
                <p
                  className="text-sm sm:text-base md:text-lg text-gray-800 mb-5 animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  {slide.subtitle}
                </p>
                <button
                  className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm sm:text-base hover:bg-gray-800 transition duration-300 transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
