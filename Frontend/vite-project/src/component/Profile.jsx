import { useContext, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  ShoppingBag,
  Heart,
  Gift,
  MessageCircle,
  Ticket,
  CreditCard,
  MapPin,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { ContextApi } from "../context/ContextApi"



const Profile = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dropdownRef = useRef(null)
  const { user, onLogout, loading } = useContext(ContextApi)
  const navigate = useNavigate()

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (loading) return null
  if (!user) return null



  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    )
  }

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Profile Trigger */}
      <motion.div
        onClick={toggleDropdown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md group"
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <span className="text-white text-sm font-bold">{getInitials(user?.name)}</span>
          </div>
        </div>

        {/* User Info (Hidden on mobile) */}
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-semibold text-gray-800 truncate max-w-24">{user?.name}</span>
          <span className="text-xs text-gray-500">Profile</span>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            dropdownOpen ? "rotate-180" : "rotate-0"
          } ${isHovered ? "text-gray-700" : ""}`}
        />
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-50"
          >
            <div className="w-80 bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-2xl rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-bold">{getInitials(user?.name)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">Welcome back!</h3>
                    <p className="text-sm font-semibold text-gray-700 truncate">{user?.name || "User Name"}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>
                </div>
              </div>

             

              {/* Footer */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                <motion.button
                  onClick={() => onLogout(navigate)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
