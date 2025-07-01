import React, { useContext } from "react";

const Favorites = ({isFavorite , onToggle}) => {
  return (
    <>
      <button
        onClick={onToggle}
        className={`absolute cursor-pointer top-2 right-2 p-2 rounded-full z-10 ${
          isFavorite
            ? "bg-red-500 text-white scale-110"
            : "bg-gray-200 text-gray-600"
        } transition-transform duration-200`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </>
  );
};

export default Favorites;
