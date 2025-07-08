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
  const [wishlistCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { favorites, authentication , cartCount } = useContext(ContextApi);
  const [cartBox, setCartBox] = useState(false);
  const navigate = useNavigate();

  // All paths that should be protected are now relative (no leading slash)
  const navLinks = [
    { name: "Home", path: "/" },              // public home
    { name: "Categories", path: "categories" },
    { name: "Electronics", path: "electronics" },
    { name: "Fashion", path: "fashion" },
    { name: "Home & Garden", path: "home-garden" },
    { name: "Sports", path: "sports" },
    { name: "Deals", path: "deals" },
    { name: "About", path: "about" },
    { name: "Contact", path: "contact" },

    // protected pages
    { name: "Orders", path: "orders" },
    { name: "Profile", path: "profile" },
  ];

  // prefix relative paths with /dashboard when authenticated
  const protectedBase = authentication ? "/dashboard" : "";

  const CartItems = () => {
    if (!authentication) {
      return navigate("/login");
    } else {
      setCartBox(true);
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
            {typeof cartCount === "number" && (
              <div className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                {authentication ? cartCount : 0}
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
        {navLinks.map(({ name, path }) => {
          const fullPath = (() => {
            if (path === "/") {
              return authentication ? "/dashboard" : "/";
            }
            // prefix relative paths with /dashboard if authenticated
            return path.startsWith("/") ? path : `${protectedBase}/${path}`;
          })();
          return (
            <Link
              key={name}
              to={fullPath}
              className="text-gray-700 hover:text-black transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 space-y-4 border-t shadow-md">
          <FuzzySearch />

          {navLinks.map(({ name, path }) => {
            const fullPath = (() => {
              if (path === "/") {
                return authentication ? "/dashboard" : "/";
              }
              return path.startsWith("/") ? path : `${protectedBase}/${path}`;
            })();
            return (
              <Link
                key={name}
                to={fullPath}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-black font-medium py-1"
              >
                {name}
              </Link>
            );
          })}
        </div>
      )}

      <FavModal showModal={showModal} setShowModal={setShowModal} />
      
      <CartItem cartBox={cartBox} setCartBox={setCartBox} />
    </nav>
  );
};

export default Navbar;
