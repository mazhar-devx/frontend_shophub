import { useState, useEffect } from "react";
import api from "../../services/api";
import { formatPrice } from "../../utils/currency";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null); // For detail view modal

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      // Currently the controller returns all orders in data.data.orders
      // (Based on my read of orderController.js: getAllOrders)
      setOrders(response.data.data.orders);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, 
        { status: newStatus }
      );
      // Refresh local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder && selectedOrder._id === orderId) {
         setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/orders/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId));
        if (selectedOrder && selectedOrder._id === orderId) {
           setSelectedOrder(null);
        }
      } catch (err) {
        alert("Failed to delete order");
        console.error(err);
      }
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const searchString = searchTerm.toLowerCase();
    const userEmail = order.user?.email || "Unknown";
    const userName = order.user?.name || "Unknown";
    const orderId = order._id;
    
    const matchesSearch = orderId.includes(searchString) || 
                          userEmail.toLowerCase().includes(searchString) || 
                          userName.toLowerCase().includes(searchString);

    const matchesStatus = filterStatus === "all" || (order.status || 'Processing').toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    Completed: "bg-green-100 text-green-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Pending: "bg-purple-100 text-purple-800",
    Cancelled: "bg-red-100 text-red-800",
    Delivered: "bg-green-200 text-green-900"
  };

  if (loading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-1 text-gray-600">Track and manage customer orders</p>
        </div>
        <div className="flex space-x-3">
           <input
              type="text"
              placeholder="Search ID or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
           <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.name || 'Unknown User'}<br/>
                        <span className="text-xs text-gray-400">{order.user?.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{order.paymentMethod.replace('_', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status || 'Processing'] || statusColors['Processing']}`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                       <div className="flex space-x-2">
                          <button onClick={() => handleUpdateStatus(order._id, 'Shipped')} className="text-blue-600 hover:text-blue-900 text-xs border border-blue-200 px-2 py-1 rounded">Ship</button>
                          <button onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="text-green-600 hover:text-green-900 text-xs border border-green-200 px-2 py-1 rounded">Deliver</button>
                          <button onClick={() => handleDeleteOrder(order._id)} className="text-red-500 hover:text-red-700">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                             </svg>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="7" className="px-6 py-12 text-center text-gray-500">No orders found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                 <h2 className="text-xl font-bold text-gray-800">Order Details #{selectedOrder._id.slice(-6)}</h2>
                 <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              
              <div className="p-6 space-y-6">
                 {/* Status Control */}
                 <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex justify-between items-center">
                    <div>
                       <span className="text-sm text-purple-600 font-bold uppercase tracking-wider">Current Status</span>
                       <p className="text-2xl font-bold text-purple-900">{selectedOrder.status || 'Processing'}</p>
                    </div>
                    <select 
                       value={selectedOrder.status || 'Processing'}
                       onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                       className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                       <option value="Pending">Pending</option>
                       <option value="Processing">Processing</option>
                       <option value="Shipped">Shipped</option>
                       <option value="Delivered">Delivered</option>
                       <option value="Cancelled">Cancelled</option>
                    </select>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                       <h3 className="font-bold text-gray-900 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Customer Info
                       </h3>
                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium text-gray-800">{selectedOrder.user?.name || 'Guest'}</p>
                          <p className="text-sm text-gray-500 mt-2">Email</p>
                          <p className="font-medium text-gray-800">{selectedOrder.user?.email || 'N/A'}</p>
                       </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-3">
                       <h3 className="font-bold text-gray-900 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Shipping Details
                       </h3>
                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-500">Shipping Address</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedOrder.shippingAddress.address}</p>
                          <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                          <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.country}</p>
                          {selectedOrder.shippingAddress?.location?.lat && (
                             <div className="mt-3 h-48 w-full rounded-lg overflow-hidden border border-gray-200 relative z-0">
                                <MapContainer 
                                    center={[selectedOrder.shippingAddress.location.lat, selectedOrder.shippingAddress.location.lng]} 
                                    zoom={13} 
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[selectedOrder.shippingAddress.location.lat, selectedOrder.shippingAddress.location.lng]} />
                                </MapContainer>
                             </div>
                          )}
                          <p className="text-gray-600 mt-2 text-sm">Phone: {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                       </div>
                    </div>
                 </div>

                 {/* Order Items */}
                 <div>
                    <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
                    <div className="border rounded-xl overflow-hidden">
                       <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                             <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                             {selectedOrder.items.map((item, idx) => (
                                <tr key={idx}>
                                   <td className="px-4 py-2 text-sm text-gray-800">
                                      <div className="flex items-center">
                                         <div className="h-10 w-10 flex-shrink-0 mr-3">
                                            {item.product?.image ? (
                                               <img className="h-10 w-10 rounded-md object-cover" src={item.product?.image} alt="" />
                                            ) : (
                                               <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-xs">N/A</div>
                                            )}
                                         </div>
                                         <span className="text-gray-900 font-medium">
                                            {item.product?.name || 'Product Deleted'}
                                         </span>
                                      </div>
                                   </td>
                                   <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                                   <td className="px-4 py-2 text-sm text-gray-600">{formatPrice(item.price)}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
                 
                 <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                       onClick={() => setSelectedOrder(null)}
                       className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                       Close
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
