import React, { useContext, useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GrowingSpinner from '../component/ui/GrowingSpinner';
import axiosInstance from '../api/axiosInstance';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';
import { ContextApi } from '../context/ContextApi';
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const {setAuthentication} = useContext(ContextApi)
  const navigate = useNavigate()
  const {state} = useLocation()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const res = await axiosInstance.post('login/', formData, {
          withCredentials: true
        });
        setAuthentication(true)
        console.log(res.data);
        toast.success('Login Successfully');
        const from = state?.from?.pathname || "/dashboard";
        navigate(from , {replace:true});
  
      } catch (error) {
        console.error(error);
        toast.error('Login Failed');
      } finally {
        setLoading(false); 
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-500/10 p-8">
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl shadow-inner focus:shadow-lg focus:bg-white transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.email ? 'ring-2 ring-red-500/20' : ''
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl shadow-inner focus:shadow-lg focus:bg-white transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/20 [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${
                    errors.password ? 'ring-2 ring-red-500/20' : ''
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
            <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-gray-800 to-black text-white font-medium py-3 px-10 rounded-lg shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transform  transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? <GrowingSpinner /> : 'Create Account'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              
            </div>

           
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to={'/register'} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <button className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}