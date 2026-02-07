import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats from our new endpoint
        const { data } = await api.get("/dashboard/stats");
        
        if (data.status === 'success') {
           const statsData = data.data;
           
           setStats({
            totalProducts: statsData.totalProducts,
            totalOrders: statsData.totalOrders,
            totalCustomers: statsData.totalCustomers,
            totalRevenue: statsData.totalRevenue,
          });

          // Map recent orders
          const mappedOrders = statsData.recentOrders.map(order => ({
            id: order._id.substring(0, 8).toUpperCase(), // Short ID
            customer: order.user ? order.user.name : (order.shippingAddress?.fullName || "Guest"),
            amount: order.totalPrice,
            status: order.orderStatus || "Pending" // Assuming orderStatus field
          }));
          setRecentOrders(mappedOrders);

          // Map recent products
          const mappedProducts = statsData.recentProducts.map(product => ({
            id: product._id,
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock
          }));
          setRecentProducts(mappedProducts);
        }
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        setLoading(false);
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const statusColors = {
    Completed: "bg-green-500/20 text-green-400 border-green-500/30",
    Processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Shipped: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Pending: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass border border-red-500/30 bg-red-500/10 rounded-2xl p-6">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-red-400">{error}</h3>
            <p className="text-red-300/70 mt-1">Please check your connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Dashboard Overview</h1>
          <p className="mt-1 text-gray-400">Welcome back, Admin</p>
        </div>
        <Link 
            to="/admin/products/new"
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-1 font-bold group"
        >
            <span className="mr-2 text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
            Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📦</span>
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">+12%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Products</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="glass border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📋</span>
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">+5%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Orders</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="glass border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-pink-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-pink-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-500/20 rounded-xl border border-pink-500/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl">👥</span>
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">+18%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Customers</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="glass border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-yellow-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">+25%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Revenue</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mt-1">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="glass border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-purple-300">{order.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{order.customer}</td>
                    <td className="px-4 py-4 text-sm text-white font-bold">${order.amount.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products */}
        <div className="glass border border-white/5 rounded-2xl p-6">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">New Products</h2>
            <Link to="/admin/products" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-3 text-lg">📦</div>
                            <div>
                                <div className="text-sm font-medium text-white">{product.name}</div>
                                <div className="text-xs text-gray-400">{product.category}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-white font-bold">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${product.stock > 10 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {product.stock} in stock
                        </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
