import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  
  return isAuth ? children : <Navigate to={`/login?redirect=${location.pathname}`} />;
}
