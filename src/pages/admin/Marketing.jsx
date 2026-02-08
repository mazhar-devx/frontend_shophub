import { useState, useEffect } from "react";
import api from "../../services/api";
import { useUIStore } from "../../zustand/uiStore";

export default function AdminMarketing() {
    const { showToast } = useUIStore();
    const [subscribers, setSubscribers] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [activeTab, setActiveTab] = useState('coupons'); // coupons, subscribers, send
    const [loading, setLoading] = useState(true);

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        value: 10,
        type: 'percentage',
        expiresDays: 30
    });
    
    const [offerData, setOfferData] = useState({
        email: '',
        discountValue: 15
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subRes, couRes] = await Promise.all([
                api.get("/marketing/subscribers"),
                api.get("/marketing/coupons")
            ]);
            
            if (subRes.data.status === 'success') setSubscribers(subRes.data.data.subscribers);
            if (couRes.data.status === 'success') setCoupons(couRes.data.data.coupons);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + parseInt(newCoupon.expiresDays));
            
            await api.post("/marketing/coupons", {
                ...newCoupon,
                discountType: newCoupon.type,
                expiresAt
            });
            
            showToast("Coupon created successfully!", "success");
            fetchData();
            setNewCoupon({ code: '', value: 10, type: 'percentage', expiresDays: 30 });
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to create coupon", "error");
        }
    };
    
    const handleSendOffer = async (e) => {
        e.preventDefault();
        try {
            await api.post("/marketing/send-offer", {
                email: offerData.email,
                type: 'percentage',
                discountValue: offerData.discountValue
            });
            
            showToast(`Offer sent to ${offerData.email}`, "success");
            fetchData(); // Refresh coupons to see the auto-generated one
            setOfferData({ email: '', discountValue: 15 });
        } catch (err) {
             showToast("Failed to send offer", "error");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
                    Marketing HQ
                </h1>
                <p className="text-gray-400 mt-1">Manage campaigns, coupons, and subscribers.</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-white/10">
                {['coupons', 'subscribers', 'send'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-4 text-sm font-medium transition-all ${
                            activeTab === tab 
                            ? 'text-pink-400 border-b-2 border-pink-500' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'coupons' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Coupon */}
                    <div className="glass p-6 rounded-2xl border border-white/10 lg:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Coupon</h3>
                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Coupon Code</label>
                                <input 
                                    type="text" 
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                                    placeholder="SUMMER2025"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white focus:border-pink-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                                    <select 
                                        value={newCoupon.type}
                                        onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Value</label>
                                    <input 
                                        type="number" 
                                        value={newCoupon.value}
                                        onChange={(e) => setNewCoupon({...newCoupon, value: e.target.value})}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Expires In (Days)</label>
                                <input 
                                    type="number" 
                                    value={newCoupon.expiresDays}
                                    onChange={(e) => setNewCoupon({...newCoupon, expiresDays: e.target.value})}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                                />
                            </div>
                            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all">
                                Create Coupon
                            </button>
                        </form>
                    </div>

                    {/* List Coupons */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold text-white mb-4">Active & History</h3>
                        {coupons.length > 0 ? coupons.map(coupon => (
                            <div key={coupon._id} className="glass p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-pink-500/30 transition-all">
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl font-mono text-pink-400 font-bold">{coupon.code}</span>
                                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                                            {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${new Date(coupon.expiresAt) > new Date() ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {new Date(coupon.expiresAt) > new Date() ? 'Active' : 'Expired'}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-gray-500 text-center py-10">No coupons found</div>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === 'subscribers' && (
                <div className="glass p-6 rounded-2xl border border-white/10">
                     <h3 className="text-xl font-bold text-white mb-6">Newsletter Subscribers ({subscribers.length})</h3>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {subscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-white/5">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{sub.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">Active</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => {
                                                    setOfferData({...offerData, email: sub.email});
                                                    setActiveTab('send');
                                                }}
                                                className="text-pink-400 hover:text-pink-300 text-sm"
                                            >
                                                Send Offer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}
            
            {activeTab === 'send' && (
                <div className="max-w-2xl mx-auto glass p-8 rounded-2xl border border-white/10">
                     <h3 className="text-2xl font-bold text-white mb-6 text-center">🎯 Send Exclusive Offer</h3>
                     <form onSubmit={handleSendOffer} className="space-y-6">
                         <div>
                             <label className="block text-sm text-gray-400 mb-2">Target Email</label>
                             <input 
                                 type="email" 
                                 value={offerData.email}
                                 onChange={(e) => setOfferData({...offerData, email: e.target.value})}
                                 placeholder="customer@example.com"
                                 className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-pink-500 outline-none"
                                 required
                             />
                         </div>
                         <div>
                             <label className="block text-sm text-gray-400 mb-2">Discount Value (%)</label>
                             <div className="relative">
                                 <input 
                                     type="number" 
                                     value={offerData.discountValue}
                                     onChange={(e) => setOfferData({...offerData, discountValue: e.target.value})}
                                     className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-pink-500 outline-none"
                                     required
                                 />
                                 <span className="absolute right-4 top-4 text-gray-500">%</span>
                             </div>
                         </div>
                         
                         <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-200">
                             ℹ️ This will generate a unique generic code (e.g., ULTRA1234) and "email" it to the user. In this demo, check the backend console logs to see the email content.
                         </div>
                         
                         <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95">
                             🚀 Send Offer Now
                         </button>
                     </form>
                </div>
            )}
        </div>
    );
}
