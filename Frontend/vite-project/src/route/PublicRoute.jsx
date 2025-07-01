import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
const PublicRoute = () => {
  return (
    <div>
      <Navbar/>
      <main>
      <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default PublicRoute