import { Navigate, Outlet,useLocation } from "react-router-dom";
import { useContext } from "react";
import { ContextApi } from "../context/ContextApi";
import Navbar from "../component/Navbar";

const ProtectedRoute = () => {
  const location = useLocation()
  const { authentication ,loading } = useContext(ContextApi);
  
  if (loading) return (
    <div className="flex justify-center items-center h-screen w-full">
    <div
      className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span
        className="sr-only"
      >
        Loading...
      </span>
    </div>
  </div>
  
  )

  return authentication ? (
    <>
      <Navbar/>
      <Outlet />
    </>
  ) : (
    <Navigate to="/" replace state={{from:location}} />
  );
};

export default ProtectedRoute;
