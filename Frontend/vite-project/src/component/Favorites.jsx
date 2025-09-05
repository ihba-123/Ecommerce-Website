import { useState } from "react"

const Favorites = ({ isFavorite, onToggle }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    onToggle()
    setTimeout(() => setIsAnimating(false), 250)
  }

  return (
    <button
      onClick={handleToggle}
      className={`relative cursor-pointer p-2 rounded-xl transition-all duration-200 group ${
        isFavorite
          ? "bg-red-50 hover:bg-red-100 text-red-500 border border-red-200"
          : "bg-white/95 hover:bg-white text-gray-500 hover:text-red-400 border border-gray-200/80 hover:border-red-200"
      } ${isAnimating ? "scale-110" : "hover:scale-105"} active:scale-95 backdrop-blur-sm shadow-sm hover:shadow-md`}
    >
      {/* Heart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isFavorite ? "0" : "1.5"}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-4 h-4 transition-all duration-200 ${isFavorite ? "text-red-500" : "group-hover:text-red-400"}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {/* Subtle Animation Ring */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-xl border-2 border-red-300 animate-ping opacity-75"></div>
      )}

      {/* Minimal Glow Effect */}
      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${
          isFavorite ? "bg-red-100/30 opacity-100" : "bg-red-50/50 opacity-0 group-hover:opacity-100"
        } -z-10`}
      ></div>
    </button>
  )
}

export default Favorites
