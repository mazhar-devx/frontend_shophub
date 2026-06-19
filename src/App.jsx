import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import CartSidebar from "./components/CartSidebar";
import SearchBar from "./components/SearchBar";
import MobileMenu from "./components/MobileMenu";
import Modal from "./components/Modal";
import BackToTop from "./components/BackToTop";

import AIHelper from "./components/AIHelper";
import GlobalAudioPlayer from "./components/GlobalAudioPlayer";
import MobileBottomNav from "./components/MobileBottomNav";
import AdminLayout from "./layouts/AdminLayout";
import VendorNamePrompt from "./components/VendorNamePrompt";
import ProtectedRoute from "./components/ProtectedRoute";
import CookieConsent from "./components/CookieConsent";
import CustomCursor from "./components/CustomCursor";
import CustomContextMenu from "./components/CustomContextMenu";
import ScrollToTop from "./components/ScrollToTop";
import ZoomBlocker from "./components/ZoomBlocker";
import { useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./features/auth/authSlice";
import { useUIStore } from "./zustand/uiStore";
import useAuth from "./hooks/useAuth";
import GoogleOneTap from "./components/GoogleOneTap";

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
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const WatchMe = lazy(() => import("./pages/WatchMe"));
const VideoUpload = lazy(() => import("./pages/VideoUpload"));
const CreatorProfile = lazy(() => import("./pages/CreatorProfile"));
const SoundPage = lazy(() => import("./pages/SoundPage"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Songs = lazy(() => import("./pages/Songs"));
const Settings = lazy(() => import("./pages/Settings"));

// Informational Pages Lazy Load
const AboutUs = lazy(() => import("./pages/info/AboutUs"));
const Careers = lazy(() => import("./pages/info/Careers"));
const PrivacyPolicy = lazy(() => import("./pages/info/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/info/TermsOfService"));
const HelpCenter = lazy(() => import("./pages/info/HelpCenter"));
const ShippingReturns = lazy(() => import("./pages/info/ShippingReturns"));
const ReturnPolicy = lazy(() => import("./pages/info/ReturnPolicy"));
const SizeGuide = lazy(() => import("./pages/info/SizeGuide"));
const ContactUs = lazy(() => import("./pages/info/ContactUs"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));


// Admin Pages Lazy Load
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const AddExpensiveProduct = lazy(() => import("./pages/admin/AddExpensiveProduct"));
const AddWebsiteForSale = lazy(() => import("./pages/admin/AddWebsiteForSale"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminBanner = lazy(() => import("./pages/admin/Banner"));
const AdminMarketing = lazy(() => import("./pages/admin/Marketing"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSkills = lazy(() => import("./pages/admin/SkillsManagement"));

// Skills Career Pages Lazy Load
const SkillsCareerLayout = lazy(() => import("./layouts/SkillsCareerLayout"));
const SkillsCareerHome = lazy(() => import("./pages/skills-career/index"));
const Academic = lazy(() => import("./pages/skills-career/Academic"));
const LiveClasses = lazy(() => import("./pages/skills-career/LiveClasses"));
const Leave = lazy(() => import("./pages/skills-career/Leave"));
const Attachments = lazy(() => import("./pages/skills-career/Attachments"));
const Homework = lazy(() => import("./pages/skills-career/Homework"));
const ExamMaster = lazy(() => import("./pages/skills-career/ExamMaster"));
const OnlineExam = lazy(() => import("./pages/skills-career/OnlineExam"));
const Supervision = lazy(() => import("./pages/skills-career/Supervision"));
const Attendance = lazy(() => import("./pages/skills-career/Attendance"));
const Library = lazy(() => import("./pages/skills-career/Library"));
const Events = lazy(() => import("./pages/skills-career/Events"));
const FeesHistory = lazy(() => import("./pages/skills-career/FeesHistory"));
const Messages = lazy(() => import("./pages/skills-career/Messages"));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-16 h-16 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
  </div>
);

import CanonicalSEO from "./components/CanonicalSEO";

function AppContent() {
  const { theme } = useUIStore();
  const location = useLocation();
  const isImmersivePage = location.pathname === '/watch-me' || 
                          location.pathname === '/songs' ||
                          location.pathname.startsWith('/creator/') || 
                          location.pathname.startsWith('/tag/') ||
                          location.pathname.startsWith('/sound/') ||
                          location.pathname === '/upload-video' ||
                          location.pathname.startsWith('/skills-career');

  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/register' ||
                     location.pathname === '/verify-otp' ||
                     location.pathname === '/forgot-password' ||
                     location.pathname === '/reset-password';

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
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const hasToken = localStorage.getItem('token');
  
  useAuth();

  if (loading && hasToken && !isAuthenticated) {
    return <PageLoader />;
  }

  return (
    <>
      <CanonicalSEO />
      <ScrollToTop />
      <ZoomBlocker />
      {!isAuthenticated && !isAuthPage && <GoogleOneTap />}
      <VendorNamePrompt />
      <CookieConsent />
      <CustomCursor />
      <CustomContextMenu />
      <GlobalAudioPlayer />
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
              </>
            )}
            <MobileMenu />
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
                  <Route path="verify-otp" element={<VerifyOTP />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-confirmation" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                  <Route path="my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="search" element={<SearchResults />} />
                  <Route path="watch-me" element={<WatchMe />} />
                  <Route path="tag/:tag" element={<WatchMe />} />
                  <Route path="sound/:id" element={<SoundPage />} />
                  <Route path="upload-video" element={<ProtectedRoute><VideoUpload /></ProtectedRoute>} />
                  <Route path="creator/:id" element={<CreatorProfile />} />
                  <Route path="inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
                  <Route path="songs" element={<Songs />} />
                  <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  {/* Informational Routes */}
                  <Route path="about-us" element={<AboutUs />} />
                  <Route path="careers" element={<Careers />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="return-policy" element={<ReturnPolicy />} />
                  <Route path="terms-of-service" element={<TermsOfService />} />
                  <Route path="help-center" element={<HelpCenter />} />
                  <Route path="shipping-returns" element={<ShippingReturns />} />
                  <Route path="size-guide" element={<SizeGuide />} />
                  <Route path="contact-us" element={<ContactUs />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogPost />} />
                </Routes>
              </Suspense>
            </main>
            {!isImmersivePage && (
              <>
                <Footer />
                <MobileBottomNav />
                <BackToTop />

                <AIHelper />
              </>
            )}
          </>
        } />
        
        {/* Skills Career routes */}
        <Route path="/skills-career" element={
          <Suspense fallback={<PageLoader />}>
            <SkillsCareerLayout />
          </Suspense>
        }>
          <Route index element={<SkillsCareerHome />} />
          <Route path="academic" element={<Academic />} />
          <Route path="live-classes" element={<LiveClasses />} />
          <Route path="leave" element={<Leave />} />
          <Route path="attachments" element={<Attachments />} />
          <Route path="homework" element={<Homework />} />
          <Route path="exam-master" element={<ExamMaster />} />
          <Route path="online-exam" element={<OnlineExam />} />
          <Route path="supervision" element={<Supervision />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="library" element={<Library />} />
          <Route path="events" element={<Events />} />
          <Route path="fees-history" element={<FeesHistory />} />
          <Route path="messages" element={<Messages />} />
        </Route>
        
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
          <Route path="products/expensive/new" element={<AddExpensiveProduct />} />
          <Route path="products/website/new" element={<AddWebsiteForSale />} />
          <Route path="products/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="marketing" element={<AdminMarketing />} />
          <Route path="banner" element={<AdminBanner />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="skills" element={<AdminSkills />} />
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
