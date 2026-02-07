import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "../components/StripeCheckout";
import axios from "axios";
import { formatPrice } from "../utils/currency";
import { API_URL } from "../utils/constants";
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
            const res = await axios.get("http://localhost:5000/api/v1/marketing/my-offers", { withCredentials: true });
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
      alert(`Please fill in all shipping fields: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleApplyCoupon = async (codeToUse = couponCode) => {
      if (!codeToUse) return;
      try {
          const res = await axios.post("http://localhost:5000/api/v1/marketing/validate-coupon", { code: codeToUse }, { withCredentials: true });
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
              // alert("Coupon Applied Successfully!"); 
              setCouponCode(codeToUse); 
              setShowOffers(false);
          }
      } catch (err) {
          alert(err.response?.data?.message || "Invalid Coupon");
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


      const response = await axios.post(`${API_URL}/api/v1/orders`, orderData, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
          // Success!
          setTimeout(() => {
            if(document.body.contains(processingToast)) document.body.removeChild(processingToast);
            setOrderPlaced(true);
            navigate("/order-confirmation");
          }, 1000);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      if(document.body.contains(processingToast)) document.body.removeChild(processingToast);
      
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes("found") || errorMessage.includes("Product with ID")) {
          alert("Some items in your cart are no longer available. The cart will be cleared.");
          localStorage.removeItem('cartState'); 
          window.location.href = '/cart'; 
      } else {
          alert("Failed to create order. Please try again. " + errorMessage);
      }
    }
  };
  
  const handlePaymentCancel = () => {
    alert("Payment cancelled");
  };
  
  // Calculate shipping
  const shipping = totalAmount > 50 ? 0 : 5.99;
  
  // Calculate tax
  const tax = totalAmount * 0.1;
  
  // Calculate total
  const total = totalAmount + shipping + tax - discount;
  
  if (cartItems.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto glass border border-white/10 rounded-3xl p-12">
          <div className="bg-white/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white">Checkout</h1>
          <p className="mb-8 text-gray-400">Your cart is empty</p>
          <button 
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all font-bold"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8 relative z-10">
         <div className="absolute top-0 left-10 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Checkout</h1>
        <p className="text-gray-400">Complete your purchase safely and securely</p>
      </div>
      
      {/* Progress Indicator */}
      <div className="mb-10 relative z-10 max-w-3xl mx-auto px-4">
        {/* Progress Line - Hidden on very small screens if needed, or adjusted */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-white/10 -z-10 rounded-full hidden sm:block"></div>
        <div className="absolute top-1/2 left-4 w-1/3 h-1 bg-gradient-to-r from-purple-600 to-cyan-400 -z-10 rounded-full box-shadow-glow hidden sm:block"></div>
        
        <div className="flex justify-between items-center relative">
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(124,58,237,0.5)] font-bold border border-white/20 text-sm sm:text-base">1</div>
            <span className="text-xs sm:text-sm font-bold text-white">Shipping</span>
          </div>
          
          {/* Mobile connecting lines */}
          <div className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-cyan-400 mx-2 rounded-full sm:hidden"></div>
          
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-white/20 text-gray-400 flex items-center justify-center mb-2 glass text-sm sm:text-base">2</div>
            <span className="text-xs sm:text-sm text-gray-400">Payment</span>
          </div>
          
          <div className="h-1 flex-1 bg-white/10 mx-2 rounded-full sm:hidden"></div>

          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-white/20 text-gray-400 flex items-center justify-center mb-2 glass text-sm sm:text-base">3</div>
            <span className="text-xs sm:text-sm text-gray-400">Confirm</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping and Payment Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10 group-hover:bg-white/10 transition-colors"></div>
            
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 border border-purple-500/30">
                <span className="text-purple-300 font-bold text-sm">1</span>
              </div>
              <h2 className="text-xl font-bold text-white">Shipping Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                    Address <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600 transition-all"
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                    City <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600 transition-all"
                    placeholder="New York"
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-2">
                    Postal Code <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600 transition-all"
                    placeholder="10001"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                    Country <span className="text-purple-400">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white transition-all appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                  >
                    <option value="" className="bg-gray-900 text-gray-400">Select Country</option>
                    <option value="Pakistan" className="bg-gray-900">Pakistan</option>
                    <option value="United States" className="bg-gray-900">United States</option>
                    <option value="Canada" className="bg-gray-900">Canada</option>
                    <option value="United Kingdom" className="bg-gray-900">United Kingdom</option>
                    <option value="Australia" className="bg-gray-900">Australia</option>
                    <option value="Germany" className="bg-gray-900">Germany</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pin Location on Map <span className="text-purple-400">*</span>
                    </label>
                    <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10 relative z-0">
                        <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: "100%", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker position={location} setPosition={setLocation} />
                        </MapContainer> 
                    </div>
                     <p className="text-xs text-gray-400 mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Click on the map to set your delivery location
                    </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer relative">
                    <input
                        type="checkbox"
                        checked={billingSameAsShipping}
                        onChange={() => setBillingSameAsShipping(!billingSameAsShipping)}
                        className="sr-only peer"
                    />
                    <div className="w-5 h-5 border border-gray-500 rounded peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all flex items-center justify-center">
                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="ml-3 text-sm text-gray-300">My billing address is the same as shipping</span>
                  </label>
                </div>
                <button 
                  type="button"
                  className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Save for later
                </button>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-colors font-medium backdrop-blur-sm"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          </div>
          
          {!billingSameAsShipping && (
            <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 animate-fade-in-down">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 border border-purple-500/30">
                  <span className="text-purple-300 font-bold text-sm">2</span>
                </div>
                <h2 className="text-xl font-bold text-white">Billing Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label htmlFor="billing-fullName" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="billing-fullName"
                    name="billing-fullName"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="billing-address" className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    id="billing-address"
                    name="billing-address"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="billing-city" className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    id="billing-city"
                    name="billing-city"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="billing-postalCode" className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                  <input
                    type="text"
                    id="billing-postalCode"
                    name="billing-postalCode"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="billing-country" className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    id="billing-country"
                    name="billing-country"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder-gray-600"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 border border-purple-500/30">
                <span className="text-purple-300 font-bold text-sm">{billingSameAsShipping ? '2' : '3'}</span>
              </div>
              <h2 className="text-xl font-bold text-white">Payment Method</h2>
            </div>
            
            {/* Discount Code */}
            <div className="mb-8 p-1 bg-black/20 rounded-xl border border-white/5 relative">
              <div className="flex">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Have a discount code?" 
                  className="flex-grow px-4 py-3 bg-transparent text-white border-0 focus:ring-0 placeholder-gray-500 uppercase"
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                    <button 
                        onClick={() => {
                            setAppliedCoupon(null);
                            setDiscount(0);
                            setCouponCode("");
                        }}
                        className="bg-red-500/20 text-red-400 px-6 py-2 rounded-lg m-1 hover:bg-red-500/30 transition-colors font-medium border border-red-500/30"
                    >
                        Remove
                    </button>
                ) : (
                    <button 
                        onClick={() => handleApplyCoupon()}
                        className="bg-white/10 text-white px-6 py-2 rounded-lg m-1 hover:bg-white/20 transition-colors font-medium border border-white/10"
                    >
                        Apply
                    </button>
                )}
              </div>
              
               {/* User Specific Offers Dropdown */}
               {userOffers.length > 0 && !appliedCoupon && (
                  <div className="mt-2 px-2">
                      <button 
                        onClick={() => setShowOffers(!showOffers)}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center mb-2"
                      >
                         <span className="mr-1">🎁</span> You have {userOffers.length} special offer{userOffers.length > 1 ? 's' : ''}!
                         <svg className={`w-4 h-4 ml-1 transform transition-transform ${showOffers ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      
                      {showOffers && (
                          <div className="space-y-2 mb-3 bg-black/40 p-3 rounded-lg border border-purple-500/20">
                              {userOffers.map((offer, idx) => (
                                  <div key={idx} className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors cursor-pointer"
                                      onClick={() => handleApplyCoupon(offer.code)}
                                  >
                                      <div>
                                          <div className="font-bold text-purple-300 text-sm">{offer.code}</div>
                                          <div className="text-gray-400 text-xs">{offer.message}</div>
                                      </div>
                                      <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded text-xs border border-purple-500/30">
                                          Use
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
               )}

              {appliedCoupon && (
                  <div className="px-4 pb-2 text-green-400 text-sm">
                      ✅ {appliedCoupon.code} applied! You saved {formatPrice(discount)}
                  </div>
              )}
            </div>
            
            <div className="space-y-4 mb-8">
              <label className={`flex items-center border rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === "credit_card" ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/10 hover:border-white/20 bg-black/20'}`}>
                <div className="relative flex items-center">
                    <input
                      type="radio"
                      id="credit-card"
                      name="payment-method"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={() => setPaymentMethod("credit_card")}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-full border border-gray-400 peer-checked:border-purple-500 peer-checked:border-2 relative flex items-center justify-center mr-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                
                <div className="flex-grow flex items-center justify-between">
                    <span className="flex items-center text-white font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Credit Card
                    </span>
                    <div className="flex space-x-2">
                        <div className="bg-white/90 rounded px-2 py-1 text-xs font-bold text-gray-800">Visa</div>
                        <div className="bg-white/90 rounded px-2 py-1 text-xs font-bold text-gray-800">Mastercard</div>
                    </div>
                </div>
              </label>
              
              <label className={`flex items-center border rounded-xl p-5 cursor-pointer transition-all ${paymentMethod === "cash_on_delivery" ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'border-white/10 hover:border-white/20 bg-black/20'}`}>
                <div className="relative flex items-center">
                    <input
                      type="radio"
                      id="cash-on-delivery"
                      name="payment-method"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={() => setPaymentMethod("cash_on_delivery")}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-full border border-gray-400 peer-checked:border-green-500 peer-checked:border-2 relative flex items-center justify-center mr-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                
                <span className="flex items-center text-white font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cash on Delivery
                </span>
              </label>
            </div>
            
            {paymentMethod === "credit_card" && (
              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
                <StripeCheckout 
                  amount={total} 
                  onSuccess={() => handlePaymentSuccess()}
                  onValidate={() => validateForm()}
                />
              </div>
            )}
            
            {paymentMethod !== "credit_card" && (
              <button
                onClick={() => handlePaymentSuccess()}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-1 font-bold text-lg"
              >
                Place Order - {formatPrice(total)}
              </button>
            )}
            
            <p className="text-center text-gray-500 text-sm mt-4">
               By placing your order you agree to our <span className="text-purple-400 hover:text-purple-300 underline cursor-pointer">Terms of Service</span>.
            </p>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 sticky top-24 shadow-2xl">
            <div className="flex items-center mb-6 border-b border-white/10 pb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 border border-purple-500/30">
                <span className="text-purple-300 font-bold text-sm">{billingSameAsShipping ? '3' : '4'}</span>
              </div>
              <h2 className="text-xl font-bold text-white">Order Summary</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex py-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 rounded-lg px-2 transition-colors">
                    <div className="bg-black/40 border border-white/10 rounded-lg flex items-center justify-center w-16 h-16 flex-shrink-0 overflow-hidden relative">
                       {item.images && item.images.length > 0 ? (
                         <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                       ) : item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       ) : (
                          <span className="text-xl">📦</span>
                       )}
                    </div>
                    <div className="ml-3 flex-grow">
                      <h3 className="font-medium text-sm text-white line-clamp-1">{item.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                          <p className="text-gray-500 text-xs bg-white/5 px-2 py-0.5 rounded">Qty: {item.quantity}</p>
                          <p className="font-bold text-sm text-purple-300">{formatPrice(item.totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 mb-6 bg-black/20 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between">
                <span className="font-medium text-white">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Shipping</span>
                <span className="font-medium text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Tax</span>
                <span className="font-medium text-white">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Discount</span>
                <span className="font-medium text-green-400">-{formatPrice(discount)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg mt-2">
                <span className="text-white">Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{formatPrice(Math.max(0, total))}</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-green-300">Free returns for 30 days</span>
              </div>
              
              <div className="flex items-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-blue-300">Estimated delivery: 2-5 days</span>
              </div>
            </div>
            
            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-start">
                <div className="bg-purple-500/20 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-purple-300 text-sm">Secure Checkout</h4>
                  <p className="text-xs text-purple-200/60 mt-1">Your information is protected with 256-bit SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}