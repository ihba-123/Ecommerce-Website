import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ContextApi } from '../context/ContextApi';

const Profile = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const { user , onLogout} = useContext(ContextApi)
  const navigate = useNavigate()

  return (
    <div className="relative z-50">
      <div
        onClick={toggleDropdown}
        className="flex flex-col items-center cursor-pointer"
      >
        <FaUserCircle size={24} />
        <span className="text-xs font-semibold mt-1">{user?.name}</span>
      </div>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-14 z-20 bg-white shadow-lg py-6 px-6 w-72"
          >
            <h6 className="font-semibold text-lg mb-1">Welcome</h6>
            <p className="text-sm text-slate-500 mb-4 font-semibold">
              {user?.name || 'User Name'} <br />
              {user?.email || 'user@example.com'}
            </p>
            <hr className="border-gray-300 my-2" />
            <ul className="space-y-1.5 mb-4">
              <li><Link to="/orders" className="text-sm text-slate-500 hover:text-pink-500">Orders</Link></li>
              <li><Link to="/wishlist" className="text-sm text-slate-500 hover:text-pink-500">Wishlist</Link></li>
              <li><Link to="/gift-cards" className="text-sm text-slate-500 hover:text-pink-500">Gift Cards</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-500 hover:text-pink-500">Contact Us</Link></li>
            </ul>

            <hr className="border-gray-300 my-2" />

            <ul className="space-y-1.5 mb-4">
              <li><Link to="/coupons" className="text-sm text-slate-500 hover:text-pink-500">Coupons</Link></li>
              <li><Link to="/credits" className="text-sm text-slate-500 hover:text-pink-500">Saved Credits</Link></li>
              <li><Link to="/addresses" className="text-sm text-slate-500 hover:text-pink-500">Saved Addresses</Link></li>
            </ul>

            <button
            onClick={()=>onLogout(navigate)}
            className="cursor-pointer px-4 py-2 bg-gray-600 hover:bg-black text-white font-semibold rounded-lg shadow transition duration-300"
          >
            Logout
          </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;