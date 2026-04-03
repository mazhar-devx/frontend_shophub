import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// We need to implement this order slice or fetching logic
// For now we will fetch directly using axios in useEffect as a quick win
// or use the existing orderController logic if available in Redux (not yet)
import api from "../services/api";
import { useState } from "react";
import { formatPrice } from "../utils/currency";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/myorders");
        setOrders(response.data.data.orders);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
     return (
        <div className="min-h-screen p-8 flex justify-center items-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
     );
  }

  return (
    <div className="p-6 md:p-12 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white">My Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 glass">
           <h3 className="text-2xl font-bold text-white mb-2">No orders found</h3>
           <p className="text-gray-400 mb-8">You haven't placed any orders yet.</p>
           <Link to="/products" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              Start Shopping
           </Link>
        </div>
      ) : (
        <div className="space-y-6">
           {orders.map(order => (
             <div key={order._id} className="glass p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-white/10 pb-4">
                   <div>
                      <span className="text-sm text-gray-400 block">Order ID</span>
                      <span className="text-lg font-mono text-white font-bold">#{order._id.slice(-6)}</span>
                   </div>
                   <div className="mt-4 md:mt-0">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                         order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                         {order.isPaid ? 'Paid' : 'Pending Payment'}
                      </span>
                      <span className="ml-3 px-4 py-2 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-400">
                         {order.status || 'Processing'}
                      </span>
                   </div>
                   <div className="mt-4 md:mt-0 text-right">
                      <span className="text-sm text-gray-400 block">Total Amount</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                         {formatPrice(order.totalPrice)}
                      </span>
                   </div>
                </div>
                
                <div className="space-y-4">
                   {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center">
                         <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                             {item.product && item.product.images && item.product.images.length > 0 ? (
                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                             ) : (
                                <span className="text-2xl">📦</span>
                             )}
                         </div>
                         <div className="ml-4">
                            <p className="text-white font-medium">{item.product ? item.product.name : 'Unknown Product'}</p>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                            <p className="text-purple-400 text-sm font-bold">{formatPrice(item.price)}</p>
                         </div>
                      </div>
                   ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-400 gap-4">
                   <div>
                      Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                   </div>
                   <div className="flex items-center text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-lg">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Estimated Delivery: {new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                   </div>
                   <div>
                      Payment: <span className="text-white capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
