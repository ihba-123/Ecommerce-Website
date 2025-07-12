import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import FuzzySearch from "./FuzzySearch";
import FavModal from "./FavModal";
import { ContextApi } from "../context/ContextApi";
import Profile from "./Profile";
import CartItem from "./CartItems";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { favorites, authentication, cartCount } = useContext(ContextApi);
  const [cartBox, setCartBox] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "category" },

    { name: "About", path: "about" },
    { name: "Contact", path: "contact" },
    { name: "Orders", path: "orders" },
  ];

  const protectedBase = authentication ? "/dashboard" : "";

  const handleCartClick = () => {
    if (!authentication) {
      navigate("/login");
    } else {
      setCartBox(true);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full z-50">
      {/* Top Navbar */}
      <div className="flex justify-between items-center px-4 py-3 md:px-8">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-black">ShopMart</h1>

        {/* Search - hidden on mobile */}
        <div className="hidden md:block w-1/2">
          <FuzzySearch />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {authentication && (
            <button
              onClick={() => setShowModal(true)}
              className="relative text-gray-700 hover:text-black"
            >
              <Heart />
              {favorites.length > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                  {favorites.length}
                </div>
              )}
            </button>
          )}

          <button
            onClick={handleCartClick}
            className="relative text-gray-700 hover:text-black"
          >
            <ShoppingCart size={22} />
            {typeof cartCount === "number" && (
              <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                {authentication ? cartCount : 0}
              </div>
            )}
          </button>

          {authentication ? (
            <Profile />
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-gray-700 hover:text-black font-semibold"
            >
              <span>Login</span>
              <User size={20} />
            </Link>
          )}

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Desktop Links */}
      <div className="hidden md:flex px-8 py-2 space-x-6 text-sm font-medium">
        {navLinks.map(({ name, path }) => {
          const fullPath =
            path === "/" ? (authentication ? "/dashboard" : "/") : `${protectedBase}/${path}`;
          return (
            <Link
              key={name}
              to={fullPath}
              className="text-gray-700 hover:text-black transition"
            >
              {name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 space-y-4 border-t border-gray-200 bg-white shadow-md">
          <FuzzySearch />
          {navLinks.map(({ name, path }) => {
            const fullPath =
              path === "/" ? (authentication ? "/dashboard" : "/") : `${protectedBase}/${path}`;
            return (
              <Link
                key={name}
                to={fullPath}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-black font-medium"
              >
                {name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <FavModal showModal={showModal} setShowModal={setShowModal} />
      <CartItem cartBox={cartBox} setCartBox={setCartBox} />
    </nav>
  );
};

export default Navbar;
