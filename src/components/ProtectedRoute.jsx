import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const hasToken = localStorage.getItem('token');

  // If loading user or we have a token but aren't authenticated yet, show nothing or a loader
  if (loading || (hasToken && !isAuthenticated)) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-black">
         <div className="w-12 h-12 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
       </div>
     );
  }
  
  return isAuthenticated ? children : <Navigate to={`/login?redirect=${location.pathname}`} />;
}
