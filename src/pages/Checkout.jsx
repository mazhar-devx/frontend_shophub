import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "../components/StripeCheckout";
import api from "../services/api";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useUIStore } from "../zustand/uiStore";

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

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });
  
    return position === null ? null : (
      <Marker position={position}></Marker>
    );
}

export default function Checkout() {
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
  const { showToast } = useUIStore(); 

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
              // Calculate discount
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
    // Validate form first
    if (!validateForm()) return;

    // Show processing toast
    const processingToast = document.createElement("div");
    processingToast.className = "fixed top-5 right-5 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center animate-fade-in-down";
    processingToast.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating Order...';
    document.body.appendChild(processingToast);

    // Calculate final total including discount
    const finalTotal = totalAmount + (totalAmount > 50 ? 0 : 5.99) + (totalAmount * 0.1) - discount;

    try {
      // Create Order API Call
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id || item._id, // Ensure correct ID field
          quantity: item.quantity
        })),
        shippingAddress: {
           ...shippingInfo,
           location: location
        },
        paymentMethod: paymentMethod,
        totalPrice: Math.max(0, finalTotal), // Ensure non-negative
        couponCode: appliedCoupon ? appliedCoupon.code : null, // Send coupon if applied
        discountAmount: discount
      };


      const response = await api.post("/orders", orderData);

      if (response.data.status === 'success') {
          // Success!
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
      if (
          errorMessage.includes("found") || 
          errorMessage.includes("product with id") || 
          errorMessage.includes("cast to objectid") || 
          errorMessage.includes("invalid id") ||
          errorMessage.includes("bad request") // Catch generic 400s if they relate to data format
      ) {
          showToast("Cart contained invalid items. It has been cleared.", "error");
          localStorage.removeItem('cart'); 
          window.location.href = '/cart'; 
      } else {
          showToast("Failed to create order. " + errorMessage, "error");
      }
    }
  };
  
  // Calculate shipping
  const shipping = totalAmount > 50 ? 0 : 5.99;
  
  // Calculate tax
  const tax = totalAmount * 0.1;
  
  // Calculate total
  const total = totalAmount + shipping + tax - discount;
  
  if (cartItems.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="glass border border-white/10 rounded-[2rem] p-12 md:p-20 max-w-2xl mx-auto relative z-10 animate-fade-in-up">
          <div className="bg-gradient-to-br from-gray-800 to-black rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl relative group">
             <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🛒</span>
             <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Your Cart is Empty</h1>
          <p className="mb-10 text-gray-400 text-lg max-w-md mx-auto leading-relaxed">Looks like you haven't discovered our latest tech yet. Time to upgrade your gear?</p>
          <button 
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-10 py-4 rounded-full hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all font-bold text-lg transform hover:-translate-y-1 active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen pt-24">
      <div className="mb-12 relative z-10 text-center md:text-left">
         <div className="absolute top-0 left-10 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Checkout</h1>
        <p className="text-gray-400 text-lg max-w-2xl">Complete your purchase safely and securely. You're just a few steps away from your new gear.</p>
      </div>
      
      {/* Progress Indicator */}
      <div className="mb-16 relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="relative flex justify-between items-center">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -z-10 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-gradient-to-r from-purple-600 to-cyan-400 -z-10 rounded-full box-shadow-glow"></div>

            {/* Step 1 */}
            <div className="bg-gray-900 z-10 px-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] font-bold border-2 border-white/20 text-lg transform scale-110">1</div>
                <span className="absolute -bottom-8 left-0 transform -translate-x-1/4 text-sm font-bold text-white mt-2 w-24">Shipping</span>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900 z-10 px-2">
                 <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-cyan-500/50 text-white flex items-center justify-center shadow-lg font-bold text-lg">2</div>
                 <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-300 mt-2 w-24">Payment</span>
            </div>

             {/* Step 3 */}
            <div className="bg-gray-900 z-10 px-2">
                 <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-white/10 text-gray-500 flex items-center justify-center font-bold text-lg">3</div>
                 <span className="absolute -bottom-8 right-0 transform translate-x-1/4 text-sm font-bold text-gray-500 mt-2 w-24">Confirm</span>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative z-0">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Shipping Section */}
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
                 <input type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" placeholder="Street address, Apt, Suite" required />
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
                    <option value="United States" className="bg-gray-900">United States</option>
                    <option value="United Kingdom" className="bg-gray-900">United Kingdom</option>
                 </select>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Phone</label>
                 <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:bg-white/10 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" placeholder="+1 (555) 000-0000" required />
              </div>

              <div className="md:col-span-2 mt-4">
                 <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     Pin Location on Map
                 </label>
                 <div className="h-80 w-full rounded-2xl overflow-hidden border border-white/20 relative z-0 shadow-inner">
                    <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: "100%", width: "100%" }}>
                         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                         <LocationMarker position={location} setPosition={setLocation} />
                    </MapContainer>
                 </div>
                 <p className="text-xs text-gray-500 mt-2 ml-1">Tip: Click on the map to set an exact delivery point for faster service.</p>
              </div>
            </div>

             <div className="mt-8 pt-6 border-t border-white/10 flex items-center">
                <label className="flex items-center cursor-pointer relative group">
                    <input type="checkbox" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(!billingSameAsShipping)} className="sr-only peer" />
                    <div className="w-6 h-6 border-2 border-gray-500 rounded-lg peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all flex items-center justify-center group-hover:border-white">
                        <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Billing address same as shipping</span>
                </label>
             </div>
          </div>
          
          {/* Payment Section */}
          <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-[80px] -z-10 group-hover:bg-cyan-600/10 transition-colors"></div>

             <div className="flex items-center mb-8 border-b border-white/10 pb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Payment Method</h2>
            </div>
            
            {/* Payment Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <label className={`relative border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === "credit_card" ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-white/10 hover:border-white/30 bg-black/20'}`}>
                    <input type="radio" name="payment" value="credit_card" checked={paymentMethod === "credit_card"} onChange={() => setPaymentMethod("credit_card")} className="sr-only" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-white">Credit Card</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "credit_card" ? 'border-purple-500' : 'border-gray-500'}`}>
                            {paymentMethod === "credit_card" && <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>}
                        </div>
                    </div>
                    <div className="flex space-x-2 opacity-70">
                        <div className="bg-white rounded px-2 py-1 text-xs font-bold text-black">VISA</div>
                        <div className="bg-white rounded px-2 py-1 text-xs font-bold text-black">MC</div>
                    </div>
                 </label>

                 <label className={`relative border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === "cash_on_delivery" ? 'border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-white/10 hover:border-white/30 bg-black/20'}`}>
                    <input type="radio" name="payment" value="cash_on_delivery" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} className="sr-only" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-white">Cash on Delivery</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cash_on_delivery" ? 'border-green-500' : 'border-gray-500'}`}>
                            {paymentMethod === "cash_on_delivery" && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Pay when your order arrives at your doorstep.</p>
                 </label>
            </div>
            
            {paymentMethod === "credit_card" && (
                <div className="bg-black/30 rounded-2xl p-6 border border-white/5 animate-fade-in-down">
                    <StripeCheckout amount={total} onSuccess={handlePaymentSuccess} onValidate={validateForm} />
                </div>
            )}
            
            {paymentMethod !== "credit_card" && (
                <button
                    onClick={handlePaymentSuccess}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-5 rounded-2xl hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 text-xl flex items-center justify-center gap-3 group"
                >
                    <span>Confirm Order</span>
                    <span className="bg-white/20 px-3 py-1 rounded text-sm group-hover:bg-white/30 transition-colors">{formatPrice(total)}</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            )}
            
            <p className="text-center text-gray-500 text-sm mt-6 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Transactions are 256-bit SSL Encrypted
            </p>
            
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
           <div className="glass border border-white/10 rounded-[2.5rem] p-6 sm:p-8 sticky top-32 shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🛍️</span> Summary
              </h2>
              
              {/* Product List */}
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {cartItems.map((item) => (
                    <div key={item.id || item._id} className="flex gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors group">
                        <div className="w-20 h-20 bg-white/5 rounded-xl border border-white/10 overflow-hidden relative flex-shrink-0">
                             <img 
                                src={item.images && item.images.length > 0 ? getProductImageUrl(item.images[0]) : (item.image ? getProductImageUrl(item.image) : "/placeholder.svg")} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => e.target.src = "/placeholder.svg"} 
                             />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-white font-bold line-clamp-1 text-sm mb-1">{item.name}</h3>
                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <div className="font-bold text-cyan-400">{formatPrice(item.totalPrice)}</div>
                        </div>
                    </div>
                 ))}
              </div>
              
              {/* Discount / Coupon */}
              <div className="mb-6">
                <div className="relative">
                    <input 
                       type="text" 
                       value={couponCode} 
                       onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                       placeholder="PROMO CODE" 
                       disabled={!!appliedCoupon}
                       className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-purple-500 outline-none uppercase tracking-widest"
                    />
                    {appliedCoupon ? (
                        <button onClick={() => { setAppliedCoupon(null); setDiscount(0); setCouponCode(""); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300 text-xs font-bold uppercase">Remove</button>
                    ) : (
                        <button onClick={() => handleApplyCoupon()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all">APPLY</button>
                    )}
                </div>
                
                {/* Available Offers */}
                 {userOffers.length > 0 && !appliedCoupon && (
                    <div className="mt-3">
                         <button onClick={() => setShowOffers(!showOffers)} className="text-xs text-purple-400 hover:text-purple-300 flex items-center font-medium">
                             Available Offers ({userOffers.length})
                             <svg className={`w-3 h-3 ml-1 transition-transform ${showOffers ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                         </button>
                         {showOffers && (
                             <div className="mt-2 space-y-2 bg-black/50 p-2 rounded-xl">
                                 {userOffers.map((offer, i) => (
                                     <div key={i} onClick={() => handleApplyCoupon(offer.code)} className="p-2 hover:bg-white/10 rounded-lg cursor-pointer flex justify-between items-center group">
                                         <div>
                                             <div className="text-xs font-bold text-white group-hover:text-purple-400">{offer.code}</div>
                                             <div className="text-[10px] text-gray-400">{offer.message}</div>
                                         </div>
                                         <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Apply</span>
                                     </div>
                                 ))}
                             </div>
                         )}
                    </div>
                 )}
                 {appliedCoupon && <div className="mt-2 text-xs text-green-400 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Coupon Applied!</div>}
              </div>
              
              {/* Cost Breakdown */}
              <div className="space-y-3 border-t border-white/10 pt-6">
                 <div className="flex justify-between text-gray-400 text-sm">
                     <span>Subtotal</span>
                     <span className="text-white font-medium">{formatPrice(totalAmount)}</span>
                 </div>
                 <div className="flex justify-between text-gray-400 text-sm">
                     <span>Shipping</span>
                     <span className="text-white font-medium">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                 </div>
                 <div className="flex justify-between text-gray-400 text-sm">
                     <span>Tax (10%)</span>
                     <span className="text-white font-medium">{formatPrice(tax)}</span>
                 </div>
                 {discount > 0 && (
                     <div className="flex justify-between text-green-400 text-sm">
                         <span>Discount</span>
                         <span className="font-bold">-{formatPrice(discount)}</span>
                     </div>
                 )}
                 <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2">
                     <span className="text-white font-bold text-lg">Total</span>
                     <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-shadow-glow">{formatPrice(Math.max(0, total))}</span>
                 </div>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-8 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center font-bold text-xs text-white">VISA</div>
                  <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center font-bold text-xs text-white">AMEX</div>
                  <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center font-bold text-xs text-white">MC</div>
                  <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center font-bold text-xs text-white">PP</div>
              </div>
           </div>
        </div>
        
      </div>
    </div>
  );
}
