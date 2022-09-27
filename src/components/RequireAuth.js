import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
const RequireAuth = ({ allowedRoles }) => {
  const { loggedUser } = useSelector((state) => state.auth);
  const location = useLocation();
  console.log("require auth", allowedRoles);
  // const stringi = 
  console.log("logged user: " + JSON.stringify(loggedUser));
  //   return loggedUser?.role === allowedRoles[0] ? (
  //     <Outlet />
  //   ) : loggedUser?.role ? (
  //     <Navigate to="/unauthorized" state={{ from: location }} replace />
  //   ) : (
  //     <Navigate to="/" state={{ from: location }} replace />
  //   );

  // return loggedUser?.role === allowedRoles[0] ? (
  //   <Outlet />
  // ) : loggedUser ? (
  //   <Navigate to="/unauthorized" state={{ from: location }} replace />
  // ) : (
  //   <Navigate to="/" state={{ from: location }} replace />
  // );

  // allowedRoles.find(ar => ar.includes(loggedUser.role)) 

return allowedRoles.includes(loggedUser?.role)? (
    <Outlet />
  ) : loggedUser ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );

};

export default RequireAuth;
