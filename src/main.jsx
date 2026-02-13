import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
// Remove the hook import if it's not used directly here or keep it if needed. 
// It was used in AppWithAuth, so we keep it.
import useAuth from "./hooks/useAuth"; 

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Initialize auth
const AppWithAuth = () => {
  useAuth();
  return <App />;
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
           <AppWithAuth />
        </GoogleOAuthProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
