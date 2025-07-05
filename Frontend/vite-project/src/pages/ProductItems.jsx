import React, { useContext, useState, useEffect } from "react";
import { ContextApi } from "../context/ContextApi";
import { useNavigate, useParams } from "react-router-dom";

const ProductItems = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const { data, loading, addToCart, updateCart, cart, authentication } =
    useContext(ContextApi);
  const { id } = useParams();
  const navigate = useNavigate()
  const product = data.find((item) => item.id === parseInt(id));

  // Find cart item for this product (if any)
  const cartItem = cart.find((item) => item.product.id === product?.id);

  // Local quantity state for unauthenticated users
  const [localQuantity, setLocalQuantity] = useState(1);

  // Sync local quantity to 1 or cartItem quantity on product/cart change
  useEffect(() => {
    if (authentication && cartItem) {
      setLocalQuantity(cartItem.quantity);
    } else {
      setLocalQuantity(1);
    }
  }, [authentication, cartItem]);

  const handleSizeSelect = (size) => setSelectedSize(size);

  const handleAddToCart = async (productId) => {
    if (!authentication) {
      // Redirect to login page if user is not authenticated
      navigate("/login", { replace: true });
      return;
    }
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQuantity = () => {
    if (authentication) {
      updateCart(cartItem.id, cartItem.quantity + 1);
    } else {
      setLocalQuantity((q) => q + 1);
    }
  };

  const decreaseQuantity = () => {
    if (authentication) {
      if (cartItem.quantity > 1) updateCart(cartItem.id, cartItem.quantity - 1);
    } else {
      setLocalQuantity((q) => (q > 1 ? q - 1 : 1));
    }
  };

  if (loading || !product)
    return <div className="text-center py-10">Loading...</div>;

  const images = product.images || [];
  const defaultMainImage = images.length > 0 ? images[0].image : "";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 sm:w-24 sm:overflow-y-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover rounded border hover:border-blue-500 cursor-pointer"
                onClick={() => setMainImage(img.image)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 flex justify-center items-center  rounded p-2 max-h-[500px]">
            <img
              src={mainImage || defaultMainImage}
              alt="Main product"
              className="max-h-[480px] w-full object-contain rounded"
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
          <p className="text-sm text-slate-500 mt-2">{product.description}</p>

          <div className="mt-6">
            <p className="text-3xl font-bold text-slate-900">${product.price}</p>
            <p className="text-green-600 text-sm mt-1">
              {product.stock > 0
                ? `${product.stock} piece${product.stock > 1 ? "s" : ""} available`
                : "Out of stock"}
            </p>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900">Choose a Size</h3>
            <div className="flex flex-wrap gap-3 mt-3">
              {["SM", "MD", "LG", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`w-10 h-10 border ${
                    selectedSize === size ? "border-black" : "border-gray-300"
                  } rounded-full flex items-center justify-center text-sm font-medium`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity controls */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900">Quantity</h3>
            <div className="flex items-center mt-3 gap-3">
              <button
                onClick={decreaseQuantity}
                className="w-8 h-8 border border-gray-300 rounded-full font-bold text-lg"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">
                {authentication ? (cartItem ? cartItem.quantity : 0) : localQuantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="w-8 h-8 border border-gray-300 rounded-full font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleAddToCart(product.id)}
              className="w-full hover:bg-gray-900 px-4 py-2.5 border border-slate-800 text-slate-900 hover:text-white cursor-pointer rounded-md"
            >
              Add to Cart
            </button>
            <button
              onClick={() => console.log("Buying now:", selectedSize)}
              className="w-full px-4 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-md"
            >
              Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Product Description
            </h3>
            <p className="text-sm text-slate-500 mt-2">{product.description}</p>
            <ul className="list-disc mt-4 pl-5 text-sm text-slate-500">
              {product.features?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItems;
