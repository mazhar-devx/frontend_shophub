import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useUIStore } from "../zustand/uiStore";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../features/cart/cartSlice";
import { store } from "../app/store";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";

export default function CartSidebar() {
  const { isCartOpen, toggleCart } = useUIStore();
  const { items: cartItems, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity(id));
  };
  
  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id));
  };
  
  if (!isCartOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Cart Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col glass border-l border-white/10 shadow-2xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-white">
                  Shopping Cart <span className="text-purple-400">({totalQuantity})</span>
                </h2>
                <button
                  type="button"
                  className="-m-2 p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={toggleCart}
                >
                  <span className="sr-only">Close panel</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-8">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <svg className="h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-white">Your cart is empty</h3>
                    <p className="mt-1 text-sm text-gray-400">Looks like you haven't added anything yet.</p>
                    <button onClick={toggleCart} className="mt-6 text-cyan-400 hover:text-cyan-300 font-medium">Start Shopping &rarr;</button>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-white/10">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-6 flex animate-fade-in-up">
                          <div className="flex-shrink-0 w-24 h-24 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                              {item.images && item.images.length > 0 ? (
                                <img src={getProductImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-cover" onError={(e) => e.target.src = '/placeholder.svg'} />
                              ) : item.image ? (
                                <img src={getProductImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" onError={(e) => e.target.src = '/placeholder.svg'} />
                              ) : (
                                <span className="text-xs text-gray-600">Img</span>
                              )}
                          </div>
                          
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-white">
                                <h3 className="line-clamp-2 pr-4">{item.name}</h3>
                                <p className="text-cyan-400">{formatPrice(item.price)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-400">{item.category}</p>
                            </div>
                            
                            <div className="flex-1 flex items-end justify-between text-sm mt-2">
                              <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                                <button
                                  onClick={() => handleDecreaseQuantity(item.id)}
                                  className="px-3 py-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-l-lg transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-2 py-1 text-white font-mono">{item.quantity}</span>
                                <button
                                  onClick={() => handleIncreaseQuantity(item.id)}
                                  className={`px-3 py-1 text-gray-400 rounded-r-lg transition-colors ${item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-white/10'}`}
                                  disabled={item.quantity >= item.stock}
                                >
                                  +
                                </button>
                              </div>
                              
                              <button
                                type="button"
                                className="font-medium text-red-500 hover:text-red-400 transition-colors"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {cartItems.length > 0 && (
              <div className="border-t border-white/10 py-6 px-4 sm:px-6 bg-black/40">
                <div className="flex justify-between text-base font-medium text-white mb-4">
                  <p>Subtotal</p>
                  <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">{formatPrice(totalAmount)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-400 mb-6">Shipping and taxes calculated at checkout.</p>
                
                <button
                  onClick={() => {
                    const { user } = store.getState().auth;
                    if (!user) {
                      toggleCart(); 
                      navigate('/login');
                      return;
                    }
                    toggleCart();
                    navigate('/checkout');
                  }}
                  className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all transform hover:-translate-y-1"
                >
                  Checkout
                </button>
                
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
                      onClick={toggleCart}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
