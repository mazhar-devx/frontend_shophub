import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from "../features/cart/cartSlice";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";

export default function Cart() {
  const { items: cartItems, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleIncreaseQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity >= item.stock) {
        // Optional: show toast here if dispatch isn't prevented by disabled button
        // But disabled button is better UX.
        return; 
    }
    dispatch(increaseQuantity(id));
  };
  
  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  // Calculate shipping
  const shipping = totalAmount > 50 ? 0 : 5.99;
  
  // Calculate tax
  const tax = totalAmount * 0.1;
  
  // Calculate total
  const total = totalAmount + shipping + tax;
  
  if (cartItems.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto glass border border-white/10 rounded-3xl p-12">
          <div className="bg-white/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white">Your Cart is Empty</h1>
          <p className="mb-8 text-gray-400">Looks like you haven't added anything to your cart yet</p>
          <Link 
            to="/products" 
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all transform hover:-translate-y-1 font-bold"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8 relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Cart</h1>
        <p className="text-gray-400">Review your items before checkout</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass border border-white/10 rounded-3xl p-6 mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Shopping Cart <span className="text-purple-400 text-sm font-normal ml-2">({totalQuantity} items)</span></h2>
              <button 
                onClick={handleClearCart}
                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center sm:items-start border border-white/5 rounded-2xl p-4 hover:bg-white/5 transition-colors bg-black/20 group">
                  <div className="bg-black/40 rounded-xl flex items-center justify-center w-full sm:w-24 h-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-50"></div>
                     {item.images && item.images.length > 0 ? (
                        <img src={getProductImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-cover" onError={(e) => e.target.src = '/placeholder.svg'} />
                     ) : item.image ? (
                        <img src={getProductImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" onError={(e) => e.target.src = '/placeholder.svg'} />
                     ) : (
                        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">📦</span>
                     )}
                  </div>
                  
                  <div className="sm:ml-6 flex-grow w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row justify-between mb-2">
                      <h3 className="font-bold text-lg text-white mb-1 sm:mb-0">{item.name}</h3>
                      <button 
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 capitalize">{item.category}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden p-1">
                        <button 
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-white font-medium text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className={`w-8 h-8 flex items-center justify-center text-white rounded-lg transition-colors ${item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="font-bold text-xl text-white">{formatPrice(item.totalPrice)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Apply Coupon
            </h3>
            <div className="flex mb-6">
              <input 
                type="text" 
                placeholder="Enter coupon code" 
                className="flex-grow px-4 py-3 bg-white/5 border border-white/10 text-white rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 placeholder-gray-500"
              />
              <button className="bg-white/10 text-white px-6 py-3 rounded-r-xl hover:bg-white/20 transition-colors font-medium border border-l-0 border-white/10">
                Apply
              </button>
            </div>
            
            <div className="space-y-3 mb-6 p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium text-white">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Discount</span>
                <span className="font-medium text-green-400">-{formatPrice(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="font-medium text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tax</span>
                <span className="font-medium text-white">{formatPrice(tax)}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl p-4 border border-purple-500/20 mb-4">
              <div className="flex items-start">
                <div className="bg-purple-500/20 rounded-full p-2 mr-3 text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-purple-300">Free Shipping Over $50</h4>
                  <p className="text-sm text-purple-400/80 mt-1">Add {formatPrice(50 - totalAmount)} more to qualify for free shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass border border-white/10 rounded-3xl p-6 sticky top-24 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal ({totalQuantity} items)</span>
                <span className="font-medium text-white">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="font-medium text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="font-medium text-white">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Discount</span>
                <span className="font-medium text-green-400">-{formatPrice(0)}</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="mb-8 space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
              <div className="flex items-center text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium">256-bit SSL Encryption</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-4 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-1 mb-4 font-bold text-lg"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              to="/products" 
              className="block text-center text-gray-400 hover:text-white font-medium transition-colors text-sm"
            >
              Continue Shopping
            </Link>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">We Accept</h3>
              <div className="flex space-x-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                <div className="bg-white/10 rounded-lg p-2 w-12 h-8 flex items-center justify-center border border-white/5">
                  <span className="text-[10px] font-bold text-white">VISA</span>
                </div>
                <div className="bg-white/10 rounded-lg p-2 w-12 h-8 flex items-center justify-center border border-white/5">
                  <span className="text-[10px] font-bold text-white">MC</span>
                </div>
                <div className="bg-white/10 rounded-lg p-2 w-12 h-8 flex items-center justify-center border border-white/5">
                  <span className="text-[10px] font-bold text-white">PP</span>
                </div>
                <div className="bg-white/10 rounded-lg p-2 w-12 h-8 flex items-center justify-center border border-white/5">
                  <span className="text-[10px] font-bold text-white">AE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
