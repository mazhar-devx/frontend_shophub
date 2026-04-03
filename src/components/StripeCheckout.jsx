import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { API_URL } from "../utils/constants";

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const CheckoutForm = ({ amount, onSuccess, onValidate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Trigger external validation
    if (onValidate && !onValidate()) {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Payment Intent
      const { data } = await axios.post(

        `${API_URL}/api/v1/payments/create-payment-intent`,
        {
          amount: amount,
          currency: "usd",
          description: "E-commerce Purchase"
        },
        { withCredentials: true }
      );

      if (data.status !== "success") {
        throw new Error("Failed to initialize payment");
      }

      // 2. Confirm Card Payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess();
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Payment processing failed");
      console.error("Payment Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black/20 p-4 rounded-xl border border-white/10">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Card Details
        </label>
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl flex items-center animate-fade-in-up">
           <svg className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all transform hover:-translate-y-1 font-bold text-lg flex items-center justify-center group"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Secure Payment...
          </>
        ) : (
          <>
            <span className="mr-2">Pay Securely</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm group-hover:bg-white/30 transition-colors">
              ${amount.toFixed(2)}
            </span>
          </>
        )}
      </button>
      
      <div className="flex items-center justify-center text-xs text-gray-500 space-x-2">
        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Encrypted & Secured by Stripe</span>
      </div>
    </form>
  );
};

export default function StripeCheckout({ amount, onSuccess, onValidate }) {
  const [stripePromise, setStripePromise] = useState(null);

  // Load Stripe only when checkout is shown (avoids HTTP warning on every page load)
  useEffect(() => {
    if (STRIPE_KEY) {
      loadStripe(STRIPE_KEY).then(setStripePromise);
    }
  }, []);

  if (!STRIPE_KEY) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
        <h3 className="text-red-400 font-bold mb-2">Stripe Configuration Error</h3>
        <p className="text-red-200/70 text-sm">
            Publishable key is missing. Please check your .env file.
        </p>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5 text-center text-gray-400">
        Loading payment form...
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onValidate={onValidate} />
    </Elements>
  );
}