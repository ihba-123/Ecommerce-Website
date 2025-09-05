import { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react"
import FuzzySearch from "./FuzzySearch"
import FavModal from "./FavModal"
import { ContextApi } from "../context/ContextApi"
import Profile from "./Profile"
import CartItem from "./CartItems"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { favorites, authentication, cartCount } = useContext(ContextApi)
  const [cartBox, setCartBox] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "category" }
  ]

  const protectedBase = authentication ? "/dashboard" : ""

  // Handle scroll effect with hide/show functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Set scrolled state for styling
      setIsScrolled(currentScrollY > 10)

      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setIsVisible(false)
      } else {
        // Scrolling up or at top
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleCartClick = () => {
    if (!authentication) {
      navigate("/login")
    } else {
      setCartBox(true)
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white shadow-sm border-b border-gray-200"
        }`}
      >
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">ShopMart</h1>
          </div>

          {/* Search - Centered and visible on desktop */}
          <div className="hidden md:flex flex-1 justify-center max-w-md mx-8">
            <FuzzySearch />
          </div>

          {/* Right-side Icons */}
          <div className="flex items-center space-x-3"> 
            {authentication && (
              <button
                onClick={() => setShowModal(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-50 rounded-lg"
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                    {favorites.length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-50 rounded-lg"
            >
              <ShoppingCart size={20} />
              {typeof cartCount === "number" && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                  {authentication ? cartCount : 0}
                </span>
              )}
            </button>

            {authentication ? (
              <Profile />
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 hover:bg-gray-50 rounded-lg"
              >
                <span className="text-sm">Login</span>
                <User size={18} />
              </Link>
            )}

            {/* Hamburger Menu (Mobile Only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-50 rounded-lg"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links - Centered */}
        <div className="hidden md:flex  gap-6 py-2 px-4 border-t border-gray-100">
          {navLinks.map(({ name, path }) => {
            const fullPath = path === "/" ? (authentication ? "/dashboard" : "/") : `${protectedBase}/${path}`
            return (
              <Link
                key={name}
                to={fullPath}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-md hover:bg-gray-50"
              >
                {name}
              </Link>
            )
          })}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Search */}
              <div className="mb-4">
                <FuzzySearch />
              </div>

              {/* Mobile Navigation Links */}
              {navLinks.map(({ name, path }) => {
                const fullPath = path === "/" ? (authentication ? "/dashboard" : "/") : `${protectedBase}/${path}`
                return (
                  <Link
                    key={name}
                    to={fullPath}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 rounded-md hover:bg-gray-50"
                  >
                    {name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-[60px] md:h-[72px]"></div>

      {/* Modals - Higher z-index to appear above navbar */}
      <div className="relative z-50">
        <FavModal showModal={showModal} setShowModal={setShowModal} />
        <CartItem cartBox={cartBox} setCartBox={setCartBox} />
      </div>
    </>
  )
}

export default Navbar
