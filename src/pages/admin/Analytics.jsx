import { useState, useEffect } from "react";
import axios from "axios";


export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/dashboard/stats", { withCredentials: true });
      if (response.data.status === 'success') {
         setStats(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
      setLoading(false);
    }
  };

  // Mock data for the graphs since we only have aggregate totals in the simple controller
  // In a real "Ultra" app, we'd need endpoints for "revenue over time", etc.
  // Transform backend dailyRevenue to chart friendly format
  const revenueData = stats.dailyRevenue ? stats.dailyRevenue.map(item => ({
      name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
      value: item.revenue,
      orders: item.orders
  })) : [];
  
  // Fill in missing days if needed or just show what we have. 
  // For "Ultra" feel, if empty, we might want to show empty state or 0s.
  if (revenueData.length === 0) {
      // Fallback/Empty state
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.forEach(day => revenueData.push({ name: day, value: 0 }));
  }

  if (loading) return <div className="p-8 text-white">Loading analytics...</div>;

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
             Ultra Analytics
           </h1>
           <p className="text-gray-400 mt-1">Real-time performance insights</p>
        </div>
        <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 border border-white/5 transition-colors">7 Days</button>
            <button className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg text-sm text-purple-300 border border-purple-500/30 transition-colors">30 Days</button>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 border border-white/5 transition-colors">90 Days</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="relative group p-6 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-all duration-500"></div>
            <p className="text-gray-400 font-medium z-10 relative">Total Revenue</p>
            <h3 className="text-3xl font-bold text-white mt-2 z-10 relative">${stats.totalRevenue.toLocaleString()}</h3>
            <div className="mt-4 flex items-center text-sm text-green-400 z-10 relative">
               <span className="bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">+12.5%</span>
               <span className="ml-2 text-gray-500">vs last period</span>
            </div>
         </div>

         <div className="relative group p-6 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all duration-500"></div>
            <p className="text-gray-400 font-medium z-10 relative">Total Orders</p>
            <h3 className="text-3xl font-bold text-white mt-2 z-10 relative">{stats.totalOrders}</h3>
            <div className="mt-4 flex items-center text-sm text-green-400 z-10 relative">
               <span className="bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">+8.2%</span>
               <span className="ml-2 text-gray-500">vs last period</span>
            </div>
         </div>

         <div className="relative group p-6 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-pink-500/20 transition-all duration-500"></div>
            <p className="text-gray-400 font-medium z-10 relative">Active Customers</p>
            <h3 className="text-3xl font-bold text-white mt-2 z-10 relative">{stats.totalCustomers}</h3>
            <div className="mt-4 flex items-center text-sm text-green-400 z-10 relative">
               <span className="bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">+24.3%</span>
               <span className="ml-2 text-gray-500">vs last period</span>
            </div>
         </div>

         <div className="relative group p-6 glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-yellow-500/20 transition-all duration-500"></div>
            <p className="text-gray-400 font-medium z-10 relative">Conversion Rate</p>
            <h3 className="text-3xl font-bold text-white mt-2 z-10 relative">3.2%</h3>
            <div className="mt-4 flex items-center text-sm text-red-400 z-10 relative">
               <span className="bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">-1.1%</span>
               <span className="ml-2 text-gray-500">vs last period</span>
            </div>
         </div>
      </div>

      {/* Charts Section - Using CSS/SVG for "Ultra" look without heavy libs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart */}
         <div className="lg:col-span-2 glass border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
               <button className="text-purple-400 text-sm hover:text-purple-300">Download Report</button>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2 px-4 relative">
               {/* Grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
                  <div className="w-full h-px bg-white"></div>
               </div>

               {revenueData.map((item, index) => {
                  const height = (item.value / 7000) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 z-10 group cursor-pointer">
                       <div className="relative w-full mx-1 bg-black/30 rounded-t-lg h-full flex items-end overflow-hidden">
                          <div 
                            style={{ height: `${height}%` }} 
                            className="w-full bg-gradient-to-t from-purple-900 to-cyan-500 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-sm relative"
                          >
                             <div className="absolute top-0 w-full h-1 bg-white/50"></div>
                          </div>
                       </div>
                       <div className="mt-3 text-xs text-gray-400">{item.name}</div>
                       
                       {/* Tooltip */}
                       <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          ${item.value}
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>

         {/* Recent Orders List - Real Data */}
         <div className="glass border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Recent Orders</h3>
            
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
               <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-300 font-bold border border-white/10">
                                  {order.user?.name ? order.user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                  <p className="text-sm font-medium text-white">{order.user?.name || 'Guest'}</p>
                                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-sm font-bold text-white">${order.totalPrice}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' : 
                                  order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                  {order.status || 'Pending'}
                              </span>
                          </div>
                      </div>
                  ))}
               </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <span className="text-2xl mb-2">💤</span>
                    <p>No recent orders</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}
