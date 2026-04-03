import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";

export default function OrderSuccess() {
  const dispatch = useDispatch();
  
  // Clear cart on mount
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass border border-white/10 rounded-3xl p-8 sm:p-12 max-w-2xl w-full text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-cyan-400 to-indigo-600"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
        
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Confetti particles - simulated with absolute divs */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-100 opacity-75"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-300 opacity-75"></div>
          <div className="absolute bottom-0 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-500 opacity-75"></div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
          Thank you for your purchase. Your order has been confirmed and is being processed. You will receive a confirmation email shortly.
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-purple-300 font-bold mb-2 text-sm uppercase tracking-wider">Order ID</h3>
            <p className="text-white font-mono text-xl tracking-widest">#{Math.floor(Math.random() * 1000000)}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/products" 
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-1"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/" 
            className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
