import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "../components/StripeCheckout";
import api from "../services/api";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import { MapContainer, TileLayer, Marker, useMapEvents, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useUIStore } from "../zustand/uiStore";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// Custom Company HQ Icon
const hqIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-pink-500/30 rounded-full animate-ping"></div>
      <div class="absolute w-8 h-8 bg-pink-500/50 rounded-full animate-pulse"></div>
      <div class="relative w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
        <span class="text-[10px] font-black text-white">SH</span>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, 15);
      }
    });
  
    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
}

const PAKISTAN_BOUNDS = [
    [23.63, 60.87], // Southwest
    [37.08, 77.83]  // Northeast
];

// Moving ComingSoonModal outside to avoid nesting issues
const ComingSoonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
        <div className="glass border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full relative z-10 animate-fade-in-up shadow-2xl overflow-hidden text-center">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl"></div>
            
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 relative group">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-500 animate-pulse">💳</span>
                <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping opacity-20"></div>
            </div>
            
            <h3 className="text-3xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Coming Soon</h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                We're currently fine-tuning our <span className="text-purple-400 font-bold underline decoration-purple-500/30">Credit Card</span> payment gateway to ensure maximum security.
            </p>
            
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">Please Use CoD</h4>
                    <p className="text-xs text-gray-400">Cash on Delivery is fully active and secure.</p>
                </div>
            </div>
            
            <button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all transform hover:-translate-y-1 active:scale-95"
            >
                Continue with CoD
            </button>
        </div>
    </div>
  );
};

export default function Checkout() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [location, setLocation] = useState(null); // { lat, lng }
  
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // Amount to subtract
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [userOffers, setUserOffers] = useState([]);
  const [showOffers, setShowOffers] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pakistanGeoJson, setPakistanGeoJson] = useState(null);
  const { showToast } = useUIStore(); 

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser", "error");
        return;
    }
    
    showToast("Requesting location permission...", "info");
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            setLocation({ lat: latitude, lng: longitude });
            showToast("Location found!", "success");
        },
        (err) => {
            showToast("Unable to retrieve your location", "error");
        }
    );
  };

  const handleMapSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=pk&q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
            showToast(`Found: ${data[0].display_name.split(',')[0]}`, "success");
        } else {
            showToast("Location not found in Pakistan", "error");
        }
    } catch (err) {
        showToast("Search failed", "error");
    } finally {
        setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
        try {
            const res = await api.get("/marketing/my-offers");
            if (res.data.status === 'success') {
                setUserOffers(res.data.data.offers);
            }
        } catch (err) {
            console.log("No specific offers found");
        }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchGeoJson = async () => {
        try {
            const res = await fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/PAK.geo.json");
            const data = await res.json();
            setPakistanGeoJson(data);
        } catch (err) {
            console.error("GeoJSON fetch failed", err);
        }
    };
    fetchGeoJson();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
        const savedInfo = localStorage.getItem('guestShippingInfo');
        const savedLocation = localStorage.getItem('guestLocation');
        
        if (savedInfo) {
            setShippingInfo(JSON.parse(savedInfo));
            localStorage.removeItem('guestShippingInfo');
        }
        if (savedLocation) {
            setLocation(JSON.parse(savedLocation));
            localStorage.removeItem('guestLocation');
        }
    }
  }, [isAuthenticated]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateForm = () => {
    const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];
    const missing = requiredFields.filter(field => !shippingInfo[field] || shippingInfo[field].trim() === '');
    
    if (missing.length > 0) {
      showToast(`Please fill in: ${missing.join(', ')}`, "error");
      return false;
    }
    return true;
  };

  const handleApplyCoupon = async (codeToUse = couponCode) => {
      if (!codeToUse) return;
      try {
          const res = await api.post("/marketing/validate-coupon", { code: codeToUse });
          if (res.data.status === 'success') {
              setAppliedCoupon(res.data.data.coupon);
              let discAmount = 0;
              if (res.data.data.coupon.discountType === 'percentage') {
                  discAmount = (totalAmount * res.data.data.coupon.value) / 100;
              } else {
                  discAmount = res.data.data.coupon.value;
              }
              setDiscount(discAmount);
              showToast("Coupon Applied Successfully!", "success");
              setCouponCode(codeToUse); 
              setShowOffers(false);
          }
      } catch (err) {
          showToast(err.response?.data?.message || "Invalid Coupon", "error");
          setAppliedCoupon(null);
          setDiscount(0);
      }
  };

  const handlePaymentSuccess = async () => {
    if (!validateForm()) return;

    if (!isAuthenticated) {
        localStorage.setItem('guestShippingInfo', JSON.stringify(shippingInfo));
        if (location) localStorage.setItem('guestLocation', JSON.stringify(location));
        
        showToast("Please login to finalize your purchase", "info");
        navigate("/login?redirect=/checkout");
        return;
    }

    const processingToast = document.createElement("div");
    processingToast.className = "fixed top-5 right-5 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center animate-fade-in-down";
    processingToast.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating Order...';
    document.body.appendChild(processingToast);

    const finalShipping = cartItems.reduce((acc, item) => acc + (item.shippingCost || 0) * item.quantity, 0);
    const finalTax = cartItems.reduce((acc, item) => acc + (item.price * item.quantity * ((item.taxPercentage || 0) / 100)), 0);
    const finalTotal = totalAmount + finalShipping + finalTax - discount;

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id || item._id,
          quantity: item.quantity
        })),
        shippingAddress: {
           ...shippingInfo,
           location: location
        },
        paymentMethod: paymentMethod,
        totalPrice: Math.max(0, finalTotal),
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        discountAmount: discount
      };

      const response = await api.post("/orders", orderData);

      if (response.data.status === 'success') {
          setTimeout(() => {
            if(document.body.contains(processingToast)) document.body.removeChild(processingToast);
            setOrderPlaced(true);
            showToast("Order placed successfully!", "success");
            navigate("/order-confirmation");
          }, 1000);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      if(document.body.contains(processingToast)) document.body.removeChild(processingToast);
      const errorMessage = (error.response?.data?.message || error.message || "").toLowerCase();
      if (errorMessage.includes("found") || errorMessage.includes("product with id") || errorMessage.includes("cast to objectid") || errorMessage.includes("invalid id") || errorMessage.includes("bad request")) {
          showToast("Cart contained invalid items. It has been cleared.", "error");
          localStorage.removeItem('cart'); 
          window.location.href = '/cart'; 
      } else {
          showToast("Failed to create order. " + errorMessage, "error");
      }
    }
  };
  
  const shipping = cartItems.reduce((acc, item) => acc + (item.shippingCost || 0) * item.quantity, 0);
  const tax = cartItems.reduce((acc, item) => acc + (item.price * item.quantity * ((item.taxPercentage || 0) / 100)), 0);
  const total = totalAmount + shipping + tax - discount;

  if (cartItems.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="glass border border-white/10 rounded-[2rem] p-12 md:p-20 max-w-2xl mx-auto relative z-10 animate-fade-in-up">
          <div className="bg-gradient-to-br from-gray-800 to-black rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl relative group">
             <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🛒</span>
             <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Your Cart is Empty</h1>
          <p className="mb-10 text-gray-400 text-lg max-w-md mx-auto leading-relaxed">Looks like you haven't discovered our latest tech yet. Time to upgrade your gear?</p>
          <button onClick={() => navigate("/products")} className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-10 py-4 rounded-full hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all font-bold text-lg transform hover:-translate-y-1 active:scale-95">Start Shopping</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen pt-24">
      <div className="mb-12 relative z-10 text-center md:text-left">
        <div className="absolute top-0 left-10 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Checkout</h1>
        <p className="text-gray-400 text-lg max-w-2xl">Complete your purchase safely and securely.</p>
      </div>
      
      <div className="mb-16 relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="relative flex justify-between items-center">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -z-10 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-gradient-to-r from-purple-600 to-cyan-400 -z-10 rounded-full box-shadow-glow"></div>
            <div className="bg-gray-900 z-10 px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] font-bold border-2 border-white/20 text-lg transform scale-110">1</div>
                <span className="absolute -bottom-8 left-0 transform -translate-x-1/4 text-sm font-bold text-white mt-2 w-24">Shipping</span>
            </div>
            <div className="bg-gray-900 z-10 px-2">
                 <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-cyan-500/50 text-white flex items-center justify-center shadow-lg font-bold text-lg">2</div>
                 <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-300 mt-2 w-24">Payment</span>
            </div>
            <div className="bg-gray-900 z-10 px-2">
                 <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-white/10 text-gray-500 flex items-center justify-center font-bold text-lg">3</div>
                 <span className="absolute -bottom-8 right-0 transform translate-x-1/4 text-sm font-bold text-gray-500 mt-2 w-24">Confirm</span>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative z-0">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] -z-10 group-hover:bg-purple-600/10 transition-colors"></div>
            <div className="flex items-center mb-8 border-b border-white/10 pb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Shipping Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
                 <input type="text" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" placeholder="Enter your full name" required />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Address</label>
                 <input type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" placeholder="Street address" required />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">City</label>
                 <input type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" placeholder="City" required />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Postal Code</label>
                 <input type="text" name="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" placeholder="ZIP Code" required />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Country</label>
                 <select name="country" value={shippingInfo.country} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none appearance-none cursor-pointer">
                    <option value="" className="bg-gray-900">Select Country</option>
                    <option value="Pakistan" className="bg-gray-900">Pakistan</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Phone</label>
                 <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" placeholder="+92 ..." required />
              </div>
              <div className="md:col-span-2 mt-4">
                 <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider flex items-center justify-between">
                     <span className="flex items-center gap-2">Pin Delivery Location</span>
                     <button type="button" onClick={handleLocateMe} className="text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1 rounded-full text-cyan-400 font-bold">Locate Me</button>
                 </label>
                 <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 relative z-0 shadow-2xl premium-map">
                    <MapContainer 
                        center={[30.3753, 69.3451]} 
                        zoom={5} 
                        style={{ height: "100%", width: "100%", background: "#030014" }}
                        maxBounds={PAKISTAN_BOUNDS}
                        minZoom={5}
                    >
                         <TileLayer 
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                         />
                         {pakistanGeoJson && (
                            <GeoJSON 
                                data={pakistanGeoJson} 
                                style={() => ({
                                    color: "#EC4899",
                                    weight: 2,
                                    opacity: 0.6,
                                    fillColor: "#EC4899",
                                    fillOpacity: 0.05
                                })}
                            />
                         )}
                         <Marker position={[30.5229, 72.6981]} icon={hqIcon} />
                         <LocationMarker position={location} setPosition={setLocation} />
                    </MapContainer>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
             <div className="flex items-center mb-8 border-b border-white/10 pb-6">
              <h2 className="text-2xl font-bold text-white">Payment Method</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <label onClick={() => setShowComingSoon(true)} className={`relative border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === "credit_card" ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 opacity-60'}`}>
                    <span className="font-bold text-white">Credit Card</span>
                 </label>
                 <label className={`relative border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === "cash_on_delivery" ? 'border-green-500 bg-green-500/10' : 'border-white/10'}`}>
                    <input type="radio" name="payment" value="cash_on_delivery" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} className="sr-only" />
                    <span className="font-bold text-white">Cash on Delivery</span>
                 </label>
            </div>
            {paymentMethod !== "credit_card" && (
                <button onClick={handlePaymentSuccess} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-5 rounded-2xl transition-all">Confirm Order {formatPrice(total)}</button>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
           <div className="glass border border-white/10 rounded-[2.5rem] p-6 sticky top-32">
              <h2 className="text-2xl font-black text-white mb-6">Summary</h2>
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto">
                 {cartItems.map((item) => (
                    <div key={item.id || item._id} className="flex gap-4 p-3 hover:bg-white/5 rounded-2xl">
                        <div className="w-20 h-20 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                             <img src={item.images && item.images.length > 0 ? getProductImageUrl(item.images[0]) : "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            <div className="font-bold text-cyan-400">{formatPrice(item.totalPrice)}</div>
                        </div>
                    </div>
                 ))}
              </div>
              <div className="space-y-3 border-t border-white/10 pt-6">
                 <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
                 <div className="flex justify-between text-white font-bold text-lg pt-4 mt-2 border-t border-white/10"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
           </div>
        </div>
      </div>
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </div>
  );
}
