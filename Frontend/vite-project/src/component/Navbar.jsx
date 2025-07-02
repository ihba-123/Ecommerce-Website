import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import FuzzySearch from "./FuzzySearch";
import FavModal from "./FavModal";
import { ContextApi } from "../context/ContextApi";
import Profile from "./Profile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { favorites, authentication } = useContext(ContextApi);
  const navigate = useNavigate();

  const CartItems = () => {
    if (authentication) {
      navigate("/dashboard/shoppingcart");
    }
  };

  return (
    <nav className="bg-white shadow-md w-full">
      {/* Main Navbar */}
      <div className="flex justify-between items-center px-4 py-3 md:px-8">
        {/* Logo */}
        <h1 className="text-2xl font-bold">ShopMart</h1>

        {/* Search bar for md+ */}
        <div className="hidden md:block w-1/2">
          <FuzzySearch />
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-4">
          {/* Wishlist */}
          {authentication && (
            <button
              onClick={() => setShowModal(true)}
              className="relative text-gray-700 hover:text-black"
            >
              <Heart />
              {wishlistCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                  {favorites.length}
                </div>
              )}
            </button>
          )}

          {/* Cart */}
          <button
            onClick={CartItems}
            className="cursor-pointer relative text-gray-700 hover:text-black"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                {cartCount}
              </div>
            )}
          </button>

          {/* Login/Profile */}
          {authentication ? (
            <Profile />
          ) : (
            <Link
              to="/login"
              className=" flex justify-center  items-center gap-1 font-semibold text-gray-700 hover:text-black"
            >
              <h1>Login</h1>
              <User size={20} />
            </Link>
          )}

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Desktop Nav Links */}
      <div className="hidden md:flex px-8 pb-3 space-x-7 py-2 text-sm font-medium">
        {[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: "Electronics", path: "/electronics" },
          { name: "Fashion", path: "/fashion" },
          { name: "Home & Garden", path: "/home-garden" },
          { name: "Sports", path: "/sports" },
          { name: "Deals", path: "/deals" },
          { name: "About", path: "/about" },
          { name: "Contact", path: "/contact" },
        ].map(({ name, path }) => (
          <Link
            key={name}
            to={path}
            className="text-gray-700 hover:text-black transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 space-y-4 border-t shadow-md">
          <FuzzySearch />

          {[
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
            { name: "Electronics", path: "/electronics" },
            { name: "Fashion", path: "/fashion" },
            { name: "Home & Garden", path: "/home-garden" },
            { name: "Sports", path: "/sports" },
            { name: "Deals", path: "/deals" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-black font-medium py-1"
            >
              {name}
            </Link>
          ))}

          {/* Wishlist button shown under profile only in mobile */}
          {authentication && (
            <div className="pt-2 border-t">
              <button
                onClick={() => setShowModal(true)}
                className="relative flex items-center space-x-2 text-gray-700 hover:text-black"
              >
                <Heart />
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                    {favorites.length}
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      <FavModal showModal={showModal} setShowModal={setShowModal} />
    </nav>
  );
};

export default Navbar;
