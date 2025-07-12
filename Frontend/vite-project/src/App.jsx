import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PublicRoute from './route/PublicRoute'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ProductItems from './pages/ProductItems'
import NotFound from './component/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './route/ProtectedRoute'
import DashboardLayout from './layout/DashboardLayout'
import Category from './pages/ProtectedPage/Category'
import CategoryProducts from './pages/CategoryProducts'
// import CartItem from './component/CartItems'

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product-detail/:id" element={<ProductItems />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/:categoryName/" element={<CategoryProducts  />} />
        </Route>


        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />} >
          <Route path="product" element={<ProductPage />} />
        </Route>
          <Route path="/dashboard/category" element={<Category />} />
          <Route path="/dashboard/category/:categoryName/" element={<CategoryProducts  />} />
          <Route path="/dashboard/product-detail/:id" element={<ProductItems />} />


          {/* <Route path="dashboard/cart" element={<CartItem />} /> */}
        </Route>
      </Routes>
    </>
  )
}

export default App
