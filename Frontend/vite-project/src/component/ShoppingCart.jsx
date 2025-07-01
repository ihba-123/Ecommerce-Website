// Optimized ReactJS Shopping Cart using multiple hooks
import React, { useState, useMemo } from 'react';

const initialCartItems = [
  {
    id: 1,
    name: 'Stylish Golden Watch',
    price: 120,
    color: '#ac7f48',
    quantity: 2,
    image: 'https://readymadeui.com/images/watch1.webp',
  },
  {
    id: 2,
    name: 'Stylish Smart Watch',
    price: 70,
    color: '#e8dcdc',
    quantity: 1,
    image: 'https://readymadeui.com/images/watch5.webp',
  },
  {
    id: 3,
    name: 'Round Glass',
    price: 20,
    color: '#000000',
    quantity: 1,
    image: 'https://readymadeui.com/images/sunglass6.webp',
  },
];

const useCartLogic = (items) => {
  const [cart, setCart] = useState(items);

  const handleIncrease = (id) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecrease = (id) => {
    setCart(prev => prev.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const handleRemove = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 2.00;
    const tax = 4.00;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cart]);

  return { cart, handleIncrease, handleDecrease, handleRemove, totals };
};

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => (
  <div className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200">
    <div className="flex gap-6 sm:gap-4 max-sm:flex-col">
      <div className="w-24 h-24 shrink-0">
        <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900">{item.name}</h3>
          <p className="text-[13px] font-medium text-slate-500 mt-2 flex items-center gap-2">
            Color:
            <span className="inline-block w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }}></span>
          </p>
        </div>
        <div className="mt-auto">
          <h3 className="text-sm font-semibold text-slate-900">${item.price.toFixed(2)}</h3>
        </div>
      </div>
    </div>

    <div className="ml-auto flex flex-col justify-between">
      <button onClick={() => onRemove(item.id)} className="self-end text-slate-400 hover:text-red-600">🗑</button>
      <div className="flex items-center gap-3">
        <button onClick={() => onDecrease(item.id)} className="bg-slate-400 text-white rounded-full w-5 h-5 flex items-center justify-center">-</button>
        <span className="font-semibold text-base">{item.quantity}</span>
        <button onClick={() => onIncrease(item.id)} className="bg-slate-800 text-white rounded-full w-5 h-5 flex items-center justify-center">+</button>
      </div>
    </div>
  </div>
);

const ShoppingCart = () => {
  const { cart, handleIncrease, handleDecrease, handleRemove, totals } = useCartLogic(initialCartItems);

  return (
    <div className="max-w-5xl max-lg:max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold text-slate-900">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 lg:gap-x-8 gap-x-6 gap-y-8 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <div className="bg-white rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
          <ul className="text-slate-500 font-medium space-y-4">
            <li className="flex justify-between text-sm">Subtotal <span className="font-semibold text-slate-900">${totals.subtotal.toFixed(2)}</span></li>
            <li className="flex justify-between text-sm">Shipping <span className="font-semibold text-slate-900">${totals.shipping.toFixed(2)}</span></li>
            <li className="flex justify-between text-sm">Tax <span className="font-semibold text-slate-900">${totals.tax.toFixed(2)}</span></li>
            <hr className="border-slate-300" />
            <li className="flex justify-between text-sm font-semibold text-slate-900">Total <span>${totals.total.toFixed(2)}</span></li>
          </ul>
          <div className="mt-8 space-y-4">
            <button className="text-sm px-4 py-2.5 w-full font-medium bg-slate-800 hover:bg-slate-900 text-white rounded-md">Buy Now</button>
            <button className="text-sm px-4 py-2.5 w-full font-medium bg-slate-50 hover:bg-slate-100 text-slate-900 border border-gray-300 rounded-md">Continue Shopping</button>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            <img src='https://readymadeui.com/images/master.webp' alt="card1" className="w-10 object-contain" />
            <img src='https://readymadeui.com/images/visa.webp' alt="card2" className="w-10 object-contain" />
            <img src='https://readymadeui.com/images/american-express.webp' alt="card3" className="w-10 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
