import { useEffect } from "react";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
const DashProtectedRoute = () => {
    const location = useLocation();
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    return localStorage.getItem("user") === null ? (
        <Outlet />
      ) : localStorage.getItem("user") ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      ) : (
        <Navigate to="/" state={{ from: location }} replace />
      );
        
 }


export default DashProtectedRoute;