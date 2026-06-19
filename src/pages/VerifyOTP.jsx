import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOTP, clearError } from "../features/auth/authSlice";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    if (error) dispatch(clearError());

    const newOtp = [...otp];
    // Allow pasting
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      // Focus last filled input
      const lastIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[lastIndex].focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if not empty
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    dispatch(verifyOTP({ email, otp: otpValue }))
      .unwrap()
      .then((payload) => {
        const user = payload?.data?.user;
        navigate(user?.role === "admin" ? "/admin/dashboard" : "/");
      })
      .catch((err) => {
        console.error("Verification failed:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/30 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10 glass border border-white/10 p-8 rounded-3xl shadow-2xl animate-fade-in-up text-center">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-2xl rotate-3 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
            <svg className="h-8 w-8 text-white transform -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            We've sent a 6-digit verification code to <br />
            <span className="font-bold text-white">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 animate-shake">
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-center gap-2 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
