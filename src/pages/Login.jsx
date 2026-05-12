import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { login, googleLogin, clearError } from "../features/auth/authSlice";
import { getProductImageUrl } from "../utils/constants";
import { formatPrice } from "../utils/currency";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const { loading, error, validationErrors } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error || validationErrors[name]) {
      dispatch(clearError());
    }
  };
  
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    dispatch(login(formData))
      .unwrap()
      .then((payload) => {
        const user = payload?.data?.user;
        if (redirect) {
          navigate(redirect);
        } else {
          navigate(user?.role === "admin" ? "/admin/dashboard" : "/");
        }
      })
      .catch((err) => {
        const errorMessage = err?.message || "Login failed";
        console.error("Login failed:", err);
        // Error is already shown in the red box below via state.auth.error
        if (errorMessage.includes("Cannot connect")) {
          // Keep focus on the message in the UI; no extra popup
        }
      });
  };

  const handleGoogleSuccess = (credentialResponse) => {
      dispatch(googleLogin(credentialResponse.credential))
        .unwrap()
        .then((payload) => {
            const user = payload?.data?.user;
            if (redirect) {
              navigate(redirect);
            } else {
              navigate(user?.role === "admin" ? "/admin/dashboard" : "/");
            }
        })
        .catch((err) => {
            console.error("Google Login Failed:", err);
        });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-main py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/30 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 relative z-10 glass border border-white/10 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-2xl rotate-3 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
             <span className="text-3xl font-bold text-white transform -rotate-3">M</span>
          </div>

          {/* Checkout Context: Show products if redirecting from checkout */}
          {redirect === '/checkout' && cartItems.length > 0 && (
            <div className="mb-10 animate-fade-in-down p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/5 relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -z-10 group-hover:bg-purple-500/30 transition-all duration-700"></div>
                
                <div className="flex -space-x-6 justify-center mb-6">
                    {cartItems.slice(0, 4).map((item, i) => (
                        <div 
                          key={i} 
                          className="w-20 h-20 rounded-2xl border-4 border-[#030014] overflow-hidden shadow-2xl transform hover:-translate-y-3 transition-all duration-500 relative z-[10] cart-item-entry"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <img 
                                src={getProductImageUrl(item.images?.[0] || item.image) || "/placeholder.svg"} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Price Badge on Hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <span className="text-[10px] font-bold text-white">{formatPrice(item.price)}</span>
                            </div>
                        </div>
                    ))}
                    {cartItems.length > 4 && (
                        <div className="w-20 h-20 rounded-2xl border-4 border-[#030014] bg-gray-900/80 backdrop-blur-md flex items-center justify-center text-white font-black text-lg relative z-0 shadow-2xl cart-item-entry" style={{ animationDelay: '400ms' }}>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">+{cartItems.length - 4}</span>
                        </div>
                    )}
                </div>
                
                <div className="text-center relative z-10">
                  <h2 className="text-3xl font-black text-white tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">Your Gear Awaits</h2>
                  <p className="text-sm font-medium text-cyan-400 uppercase tracking-[0.2em] animate-pulse">Sign in to complete order</p>
                  
                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500 font-bold border-t border-white/5 pt-4">
                     <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        SECURE
                     </div>
                     <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                     <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        ENCRYPTED
                     </div>
                  </div>
                </div>
            </div>
          )}

          {!redirect || redirect !== '/checkout' ? (
            <>
              <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-primary">
                Welcome Back
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Sign in to access your account
              </p>
            </>
          ) : null}
          
          <p className="mt-1 text-center text-xs text-gray-500">
            Admin? Use an account with role <code className="bg-white/10 px-1 rounded">admin</code> in the database.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {(error || Object.keys(validationErrors).length > 0) && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 animate-shake">
              <div className="flex gap-3">
                 <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-red-400 break-words">
                      {error || Object.values(validationErrors)[0]}
                    </h3>
                 </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-3 bg-white/5 border ${validationErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl placeholder-gray-500 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="Ex. john@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-3 bg-white/5 border ${validationErrors.password ? 'border-red-500' : 'border-white/10'} rounded-xl placeholder-gray-500 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
              />
            </div>
            {(formData.email.toLowerCase() === 'admin@example.com' || formData.email.toLowerCase() === 'admin@shophub.pro') && (
              <div className="animate-fade-in-down">
                <label htmlFor="vendorName" className="block text-sm font-medium text-cyan-400 mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Admin Identity Name
                </label>
                <input
                  id="vendorName"
                  name="vendorName"
                  type="text"
                  required
                  value={formData.vendorName || ""}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl placeholder-cyan-500/50 text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                  placeholder="e.g. Ultra Store"
                />
                <p className="text-xs text-cyan-500/70 mt-2">
                  Enter your unique admin name to access your isolated store.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-white/5 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
             <button
               type="button"
               onClick={handleSubmit}
               disabled={loading}
               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all transform hover:-translate-y-0.5"
             >
               <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {!loading && (
                     <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                     </svg>
                  )}
               </span>
               {loading ? (
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               ) : null}
               {loading ? "Authenticating..." : "Sign in"}
             </button>

             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-2 bg-main text-gray-400">Or continue with</span>
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Login Failed')}
                    theme={document.documentElement.getAttribute('data-theme') === 'light' ? 'outline' : 'filled_black'}
                    shape="pill"
                    text="continue_with"
                    width={400}
                />
                <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest font-bold">
                  Google One Tap enabled. Ensure cookies are accepted.
                </p>
             </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to={`/register${redirect ? `?redirect=${redirect}` : ""}`} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 hover:text-white transition-all">
              Sign up today
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
