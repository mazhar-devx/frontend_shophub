import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import CartSidebar from "./components/CartSidebar";
import SearchBar from "./components/SearchBar";
import MobileMenu from "./components/MobileMenu";
import Modal from "./components/Modal";
import BackToTop from "./components/BackToTop";
import WhatsAppContact from "./components/WhatsAppContact";
import AIHelper from "./components/AIHelper";
import MobileBottomNav from "./components/MobileBottomNav";
import AdminLayout from "./layouts/AdminLayout";
import VendorNamePrompt from "./components/VendorNamePrompt";
import { useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./features/auth/authSlice";
import { useUIStore } from "./zustand/uiStore";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Categories = lazy(() => import("./pages/Categories"));
const Deals = lazy(() => import("./pages/Deals"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const WatchMe = lazy(() => import("./pages/WatchMe"));
const VideoUpload = lazy(() => import("./pages/VideoUpload"));
const CreatorProfile = lazy(() => import("./pages/CreatorProfile"));

// Admin Pages Lazy Load
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminBanner = lazy(() => import("./pages/admin/Banner"));
const AdminMarketing = lazy(() => import("./pages/admin/Marketing"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-16 h-16 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const { theme } = useUIStore();
  const location = useLocation();
  const isImmersivePage = location.pathname === '/watch-me' || 
                          location.pathname.startsWith('/creator/') || 
                          location.pathname.startsWith('/tag/') ||
                          location.pathname === '/upload-video';

  useEffect(() => {
    if (theme === 'system') {
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = (e) => {
        document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      applySystemTheme(darkQuery);
      darkQuery.addEventListener('change', applySystemTheme);
      return () => darkQuery.removeEventListener('change', applySystemTheme);
    } else {
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <>
      <VendorNamePrompt />
      <Routes>
        {/* Portfolio route - Full screen, no layout */}
        <Route path="/mazhar.devx" element={
          <Suspense fallback={<PageLoader />}>
            <Portfolio />
          </Suspense>
        } />

        {/* Public routes */}
        <Route path="/*" element={
          <>
            {!isImmersivePage && (
              <>
                <Navbar />
                <SearchBar />
                <CartSidebar />
                <MobileMenu />
              </>
            )}
            <Toast />
            <Modal />
            <main id="main-content" className={`${isImmersivePage ? 'pt-0 pb-0' : 'pt-24 pb-20 md:pb-0'} min-h-screen overflow-x-hidden`}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="deals" element={<Deals />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-confirmation" element={<OrderSuccess />} />
                  <Route path="my-orders" element={<MyOrders />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="search" element={<SearchResults />} />
                  <Route path="watch-me" element={<WatchMe />} />
                  <Route path="tag/:tag" element={<WatchMe />} />
                  <Route path="upload-video" element={<VideoUpload />} />
                  <Route path="creator/:id" element={<CreatorProfile />} />
                </Routes>
              </Suspense>
            </main>
            {!isImmersivePage && (
              <>
                <Footer />
                <MobileBottomNav />
                <BackToTop />
                <WhatsAppContact />
                <AIHelper />
              </>
            )}
          </>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={
          <Suspense fallback={<PageLoader />}>
            <AdminLayout />
          </Suspense>
        }>  
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="marketing" element={<AdminMarketing />} />
          <Route path="banner" element={<AdminBanner />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
