import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import Cookies from 'js-cookie';
import { Navigate, replace } from "react-router-dom";
export const ContextApi = createContext();

const ContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [authentication , setAuthentication] = useState(null)
  const [user , setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('profile/'); 
        setAuthentication(true);
        console.log(res.data)
        setUser(res.data);
      } catch (err) {
        setAuthentication(false);
        setUser(null);
      }finally{
        setLoading(false);
      }
    }
    checkAuth();
    
  }, []);


  
  

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("product-list/");
        console.log(res.data)
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favourite") || "[]");
    setFavorites(stored);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favourite", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };


// call this on logout button click
const onLogout = async (navigate) => {
  try {
    const res = await axiosInstance.post('logout/');
    console.log("Logout Success", res.data.message);
    setAuthentication(false);
    setUser(null);
    navigate('/login', { replace: true }); 
  } catch (err) {
    console.error("Logout Failed", err.response?.data || err.message);
  }
};






  return (
    <ContextApi.Provider value={{authentication,user , setLoading ,onLogout, setAuthentication, data, loading, favorites, toggleFavorite }}>
      {children}
    </ContextApi.Provider>
  );
};

export default ContextProvider;
