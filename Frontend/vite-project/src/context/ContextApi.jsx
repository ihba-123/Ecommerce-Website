import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
export const ContextApi = createContext();
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const ContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [authentication, setAuthentication] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const checkAuth = async () => {
    try {
      const cookie = Cookies.get("access_token");
      if (cookie) {
        setAuthentication(true);
        await profile();
      } else {
        setAuthentication(false);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Auth check failed:", err.response?.data || err.message);
      }
      setAuthentication(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const profile = async () => {
    try {
      const res = await axiosInstance.get("profile/", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Auth check failed:", err.response?.data || err.message);
      }
      setAuthentication(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authentication) {
      profile();
    }
  }, [authentication]);

  //Cart Items

  const carts = async () => {
    try {
      const res = await axiosInstance.get("cart/", {
        withCredentials: true,
      });
      setCart(res.data);
      setCartCount(res.data.length);
      console.log("Cart Items :-", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    carts();
  }, []);

  //Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await axiosInstance.post(
        "add-to-cart/",
        { product_id: productId, quantity },
        {
          withCredentials: true,
        }
      );
      console.log("Data-", res.data);
      setCartCount((res) => res + 1);
      toast.success("Items added successfully");
      await carts();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add the items");
    }
  };

  useEffect(() => {
    if (authentication) {
      carts();
    }
  }, [authentication]);

  //Update the cart
  const updateCart = async (productId, quantity = 1) => {
    try {
      const res = await axiosInstance.put(
        `update-cart/${productId}/`,
        { quantity },
        {
          withCredentials: true,
        }
      );
      console.log("Data-", res.data);

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: res.data.quantity }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  //Delete the cartItems
  const deleteCart = async (item_id) => {
    try {
      const res = await axiosInstance.delete(`remove-from-cart/${item_id}/`, {
        withCredentials: true,
      });
      console.log("Data-", res.data);
      setCartCount((res) => res - 1);
      toast.success("Items deleted successfully");
      await carts();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the items");
    }
  };

  //  Total Price
  const totalPrice = cart
    .reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0)
    .toFixed(2);

    

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("product-list/");
        console.log(res.data);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  //Favrouite part
  const favrouite = async () => {
    try {
      const res = await axiosInstance.get("favorites/");
      // Extract only product IDs
      const favIds = res.data.map((fav) => fav.product);
      setFavorites(favIds); // Now it's an array of product IDs
    } catch (error) {
      console.log(error);
    }
  };

  //Add to favrouite
  const toggleFavorite = async (productId) => {
    try {
      if (favorites.includes(productId)) {
        // Remove from favorite
        await axiosInstance.delete(`favorites/${productId}/`);
        setFavorites((prev) => prev.filter((id) => id !== productId));
      } else {
        // Add to favorite
        await axiosInstance.post("favorites/", { product: productId });
        setFavorites((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  useEffect(() => {
    favrouite();
    
  }, [authentication]);

  // call this on logout button click
  const onLogout = async (navigate) => {
    try {
      const res = await axiosInstance.post("logout/");
      console.log("Logout Success", res.data.message);
      setAuthentication(false);
      setUser(null);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout Failed", err.response?.data || err.message);
    }
  };

  return (
    <ContextApi.Provider
      value={{
        authentication,
        user,
        setLoading,
        onLogout,
        setAuthentication,
        data,
        loading,
        favorites,
        toggleFavorite,
        cart,
        addToCart,
        cartCount,
        updateCart,
        deleteCart,
        totalPrice,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

export default ContextProvider;
