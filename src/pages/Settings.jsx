import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useUIStore } from '../zustand/uiStore';
import { 
  User, Bell, Shield, Palette, Globe, Smartphone, 
  Moon, Sun, Monitor, Check, CreditCard, Key, 
  LogOut, Save, Camera, Edit2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import SEO from '../components/SEO';
import { getProductImageUrl, DEFAULT_AVATAR } from '../utils/constants';

const SETTINGS_TABS = [
  { id: 'account', label: 'Account Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
];

export default function Settings() {
  const { user } = useSelector((state) => state.auth);
  const { theme, setTheme } = useUIStore();
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  // Mock states for settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    promotions: true,
    orders: true,
    messages: true
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showOnlineStatus: false,
    twoFactorAuth: false,
    dataSharing: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Settings saved successfully!");
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-6 p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -z-10" />
               <div className="relative group">
                 <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                   <img src={user?.photo ? getProductImageUrl(user.photo) : DEFAULT_AVATAR} className="w-full h-full object-cover" alt="Profile" />
                 </div>
                 <button className="absolute bottom-0 right-0 p-2 bg-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                 </button>
               </div>
               <div>
                  <h3 className="text-2xl font-black text-primary dark:text-white mb-1">{user?.name}</h3>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-3">{user?.email}</p>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
                     {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                  <div className="relative">
                     <input type="text" defaultValue={user?.name} className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all dark:text-white" />
                     <Edit2 className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
                  <div className="relative">
                     <input type="email" defaultValue={user?.email} disabled className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-2xl px-5 py-4 font-bold text-gray-500 cursor-not-allowed" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Phone Number</label>
                  <input type="text" placeholder="+1 (555) 000-0000" className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all dark:text-white" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Location</label>
                  <input type="text" placeholder="New York, USA" className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all dark:text-white" />
               </div>
            </div>
          </motion.div>
        );
      
      case 'appearance':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div>
               <h4 className="text-lg font-black uppercase tracking-widest mb-6 dark:text-white">Global Theme</h4>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                     { id: 'light', name: 'Light Mode', icon: Sun, desc: 'Clean and bright' },
                     { id: 'dark', name: 'Dark Mode', icon: Moon, desc: 'Easy on the eyes' },
                     { id: 'system', name: 'System Auto', icon: Monitor, desc: 'Matches device' }
                  ].map(t => (
                     <button 
                       key={t.id}
                       onClick={() => setTheme(t.id)}
                       className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all ${theme === t.id ? 'border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/10 scale-105' : 'border-gray-200 dark:border-white/10 hover:border-cyan-500/50 bg-white dark:bg-[#1a1a1a]'}`}
                     >
                        <div className={`p-4 rounded-full mb-4 ${theme === t.id ? 'bg-cyan-500 text-white' : 'bg-gray-100 dark:bg-black text-gray-500'}`}>
                           <t.icon className="w-8 h-8" />
                        </div>
                        <span className="font-black text-primary dark:text-white mb-1">{t.name}</span>
                        <span className="text-xs font-bold text-gray-500">{t.desc}</span>
                        {theme === t.id && <div className="absolute top-4 right-4 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                     </button>
                  ))}
               </div>
            </div>
            <div className="pt-8 border-t border-gray-200 dark:border-white/10">
               <h4 className="text-lg font-black uppercase tracking-widest mb-6 dark:text-white">Language & Region</h4>
               <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Language</label>
                     <select className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:border-cyan-500 dark:text-white appearance-none">
                        <option>English (US)</option>
                        <option>Urdu</option>
                        <option>Arabic</option>
                     </select>
                  </div>
                  <div className="flex-1 space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Currency</label>
                     <select className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:border-cyan-500 dark:text-white appearance-none">
                        <option>PKR (Rs)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                     </select>
                  </div>
               </div>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden divide-y divide-gray-200 dark:divide-white/10">
               {[
                 { id: 'orders', title: 'Order Updates', desc: 'Get notified when your order status changes' },
                 { id: 'promotions', title: 'Promotions & Deals', desc: 'Receive exclusive offers and flash deals' },
                 { id: 'messages', title: 'Direct Messages', desc: 'When creators or sellers message you' }
               ].map(item => (
                  <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                     <div>
                        <h4 className="font-black text-primary dark:text-white text-lg">{item.title}</h4>
                        <p className="text-sm text-gray-500 font-medium mt-1">{item.desc}</p>
                     </div>
                     <button 
                       onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                       className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${notifications[item.id] ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-white/20'}`}
                     >
                        <motion.div 
                          layout 
                          className="w-6 h-6 bg-white rounded-full shadow-md"
                          animate={{ x: notifications[item.id] ? 24 : 0 }}
                        />
                     </button>
                  </div>
               ))}
            </div>

            <div className="pt-4">
               <h4 className="text-sm font-black uppercase tracking-widest mb-4 text-gray-500 ml-2">Delivery Methods</h4>
               <div className="flex gap-4">
                  {[
                    { id: 'email', label: 'Email', icon: Globe },
                    { id: 'push', label: 'Push', icon: Bell },
                    { id: 'sms', label: 'SMS', icon: Smartphone }
                  ].map(method => (
                     <button 
                       key={method.id}
                       onClick={() => setNotifications({...notifications, [method.id]: !notifications[method.id]})}
                       className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${notifications[method.id] ? 'border-purple-500 bg-purple-500/10 text-purple-500' : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-purple-500/50'}`}
                     >
                        <method.icon className="w-6 h-6" />
                        <span className="font-bold text-sm">{method.label}</span>
                     </button>
                  ))}
               </div>
            </div>
          </motion.div>
        );

      case 'privacy':
         return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
               <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex gap-4 items-start">
                  <div className="p-3 bg-red-500 rounded-full text-white shadow-lg"><Key className="w-6 h-6" /></div>
                  <div>
                     <h4 className="font-black text-red-500 text-lg mb-1">Two-Factor Authentication</h4>
                     <p className="text-sm text-red-500/80 font-bold mb-4">Protect your account with an extra layer of security. We strongly recommend enabling 2FA.</p>
                     <button className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg">Enable 2FA</button>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden divide-y divide-gray-200 dark:divide-white/10">
                  {[
                    { id: 'publicProfile', title: 'Public Profile', desc: 'Allow others to see your profile and saved items' },
                    { id: 'showOnlineStatus', title: 'Online Status', desc: 'Show when you are active on ShopHub' },
                    { id: 'dataSharing', title: 'Analytics & Personalization', desc: 'Allow us to use your browsing data for better recommendations' }
                  ].map(item => (
                     <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div>
                           <h4 className="font-black text-primary dark:text-white text-lg">{item.title}</h4>
                           <p className="text-sm text-gray-500 font-medium mt-1">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => setPrivacy({...privacy, [item.id]: !privacy[item.id]})}
                          className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${privacy[item.id] ? 'bg-green-500' : 'bg-gray-300 dark:bg-white/20'}`}
                        >
                           <motion.div 
                             layout 
                             className="w-6 h-6 bg-white rounded-full shadow-md"
                             animate={{ x: privacy[item.id] ? 24 : 0 }}
                           />
                        </button>
                     </div>
                  ))}
               </div>
            </motion.div>
         );
         
      case 'billing':
         return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <CreditCard className="w-10 h-10 text-gray-400" />
               </div>
               <h3 className="text-2xl font-black text-primary dark:text-white mb-2">No Payment Methods</h3>
               <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">Add a credit card or link your PayPal account to make checkout faster and easier.</p>
               <button className="px-8 py-4 bg-primary dark:bg-white text-white dark:text-black rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl">
                  Add Payment Method
               </button>
            </motion.div>
         );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030014] pt-32 pb-20 px-4 transition-colors duration-500">
      <SEO title="Account Settings | HA Store" description="Manage your HA Store account preferences, privacy, and appearance." />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-80 flex-shrink-0">
             <div className="sticky top-32 space-y-8">
                <div>
                   <h1 className="text-4xl font-black text-primary dark:text-white tracking-tighter mb-2">Settings</h1>
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your experience</p>
                </div>

                <div className="flex flex-col gap-2">
                   {SETTINGS_TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative overflow-hidden group ${activeTab === tab.id ? 'bg-primary dark:bg-white text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'}`}
                      >
                         <tab.icon className={`w-5 h-5 relative z-10 ${activeTab === tab.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
                         <span className="font-black relative z-10">{tab.label}</span>
                      </button>
                   ))}
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-white/10">
                   <button className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-black group">
                      <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
                   </button>
                </div>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
             <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] min-h-[600px] flex flex-col">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-white/5">
                   <h2 className="text-2xl font-black text-primary dark:text-white tracking-tight flex items-center gap-3">
                      {React.createElement(SETTINGS_TABS.find(t => t.id === activeTab)?.icon || (() => null), { className: "w-6 h-6 text-cyan-500" })}
                      {SETTINGS_TABS.find(t => t.id === activeTab)?.label}
                   </h2>
                   
                   <button 
                     onClick={handleSave}
                     disabled={isSaving}
                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                   >
                      {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                   </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 relative">
                   <AnimatePresence mode="wait">
                      <TabContent key={activeTab} />
                   </AnimatePresence>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
