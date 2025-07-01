import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import GrowingSpinner from '../component/ui/GrowingSpinner';
import { Link,useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'At least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Include an uppercase letter';
    else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Include a number';

    if (!formData.password2) newErrors.password2 = 'Please confirm your password';
    else if (formData.password !== formData.password2) newErrors.password2 = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const res = await axiosInstance.post('registration/', formData);
        toast.success('Registration successful');
        console.log(res.data);
        navigate('/login', { replace: true });
      } catch (error) {
        console.error(error);
        toast.error('Registration failed');
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
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-500/10 p-8">
          <div className="space-y-6">

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl shadow-inner transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.name ? 'ring-2 ring-red-500/20' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl shadow-inner transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.email ? 'ring-2 ring-red-500/20' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50/50 rounded-2xl shadow-inner transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.password ? 'ring-2 ring-red-500/20' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="password2" className="block text-sm font-semibold text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  name="password2"
                  value={formData.password2}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50/50 rounded-2xl shadow-inner transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.password2 ? 'ring-2 ring-red-500/20' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword2(prev => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-gray-800 to-black text-white font-medium py-3 px-10 rounded-lg shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transform  transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? <GrowingSpinner /> : 'Create Account'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to={'/login'} className="cursor-pointer text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          By creating an account, you agree to our{' '}
          <button className="text-indigo-600 hover:text-indigo-700">Terms of Service</button> and{' '}
          <button className="text-indigo-600 hover:text-indigo-700">Privacy Policy</button>.
        </div>
      </div>
    </div>
  );
}
