import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateVendorName } from "../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Store, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function VendorNamePrompt() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [vendorName, setVendorName] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Show prompt if user is admin and hasn't chosen a session vendor name
    const storedIdentifier = localStorage.getItem("vendorIdentifier");
    if (user && user.role === "admin" && !storedIdentifier) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorName.trim()) {
      setError("Please enter a unique name or number");
      return;
    }

    // Save to localStorage so it's sent in the X-Vendor-Identifier header
    localStorage.setItem("vendorIdentifier", vendorName.trim());
    
    // Success - Hide prompt and reload to fetch isolated data
    setShow(false);
    window.location.reload(); 
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0f0f0f] rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
          >
            {/* Design Elements */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-24 h-24 text-cyan-500" />
            </div>
            
            <div className="p-8 sm:p-12">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8">
                <Store className="w-8 h-8 text-cyan-500" />
              </div>

              <h2 className="text-3xl font-black text-primary dark:text-white mb-4 leading-tight">
                Establish Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">
                  Vendor Identity
                </span>
              </h2>

              <p className="text-secondary dark:text-gray-400 mb-8 font-medium">
                Welcome, Admin! To proceed, please choose a unique name for your store. 
                This name will represent you to customers and isolate your products.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => {
                        setVendorName(e.target.value);
                        setError("");
                    }}
                    placeholder="e.g. Ultra Tech Store"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-primary dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold text-lg"
                    required
                    autoFocus
                  />
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 font-medium px-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative bg-black dark:bg-white text-white dark:text-black font-black py-4 px-8 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-xl"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? "Establishing Identity..." : "Get Started"}
                    {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secure Admin Verification Active
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
