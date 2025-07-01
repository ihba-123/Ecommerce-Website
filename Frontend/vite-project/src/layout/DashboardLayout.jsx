import React from 'react'
import HomePage from '../pages/HomePage'
import { Outlet } from "react-router-dom";
const DashboardLayout = () => {
  return (
    <>
    <HomePage/>
    <div>
        <Outlet /> 
    </div>
    </>
  )
}

export default DashboardLayout