import { useEffect, useState, useMemo, useCallback, useRef, useDeferredValue, startTransition } from "react";
import { formatPrice } from "../utils/currency";
import { getProductImageUrl } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductList from "../components/ProductList";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import api from "../services/api";
import { addToCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import HomeSkeleton from "../components/HomeSkeleton";
import ReviewMarquee from "../components/ReviewMarquee";
import GoogleAd from "../components/GoogleAd";
import CategoryGrid from "../components/CategoryGrid";
import ProductSlider from "../components/ProductSlider";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════
   PERFORMANCE HOOKS — Zero Dependencies
   ═══════════════════════════════════════════════ */

const IO_OPTIONS = { threshold: 0.08, rootMargin: "0px 0px -40px 0px" };
const EASE = "cubic-bezier(0.16,1,0.3,1)";

function useReveal(opts) {
  const ref = useRef(null);
  const [vis, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active = true;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && active) { active = false; startTransition(() => set(true)); io.unobserve(el); } },
      opts || IO_OPTIONS
    );
    io.observe(el);
    return () => { active = false; io.disconnect(); };
  }, [opts]);
  return [ref, vis];
}

function useProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          setP(max > 0 ? window.scrollY / max : 0);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return p;
}

function useCountUp(target, dur = 2000) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ran.current) {
          ran.current = true;
          const t0 = performance.now();
          const step = (now) => {
            const p = Math.min((now - t0) / dur, 1);
            startTransition(() => setN(Math.floor((1 - Math.pow(1 - p, 3)) * target)));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, dur]);
  return [ref, n];
}

/* ═══════════════════════════════════════════════
   MICRO COMPONENTS — GPU-Only Transforms
   ═══════════════════════════════════════════════ */

const DIRS = { up: "translateY(48px)", down: "translateY(-48px)", left: "translateX(-48px)", right: "translateX(48px)", scale: "scale(0.93)" };

function Reveal({ children, className = "", delay = 0, dir = "up" }) {
  const [ref, v] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        contain: "layout style paint",
        opacity: v ? 1 : 0,
        transform: v ? "none" : DIRS[dir],
        transition: `opacity .85s ${EASE} ${delay}ms, transform .85s ${EASE} ${delay}ms`,
        willChange: v ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

function Stagger({ children, className = "", gap = 80 }) {
  const [ref, v] = useReveal();
  const arr = Array.isArray(children) ? children : [children];
  return (
    <div ref={ref} className={className}>
      {arr.map((c, i) => (
        <div
          key={i}
          style={{
            opacity: v ? 1 : 0,
            transform: v ? "none" : "translateY(24px)",
            transition: `opacity .6s ${EASE} ${i * gap}ms, transform .6s ${EASE} ${i * gap}ms`,
            willChange: v ? "auto" : "opacity, transform",
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

function CountUp({ target, suffix = "" }) {
  const [ref, n] = useCountUp(target);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function Particles() {
  const dots = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    w: 2 + (i % 3) * 2,
    l: `${14 + i * 14}%`,
    t: `${18 + (i % 3) * 26}%`,
    d: `${i * 0.5}s`,
    dur: `${3.2 + i * 0.5}s`,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400/20 dark:bg-cyan-400/10"
          style={{
            width: d.w, height: d.w, left: d.l, top: d.t,
            animation: `pf ${d.dur} ease-in-out infinite`,
            animationDelay: d.d,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STATIC DATA — Allocated Once Outside Render
   ═══════════════════════════════════════════════ */

const DUMMY = [
  { _id: "d1", name: "Ultra Wireless Headphones", price: 299.99, ratingsAverage: 4.8, ratingsQuantity: 120, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"], category: "electronics" },
  { _id: "d2", name: "Smart Watch Series 7", price: 399.99, ratingsAverage: 4.7, ratingsQuantity: 85, images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60"], category: "electronics" },
  { _id: "d3", name: "Ergonomic Gaming Chair", price: 159.99, ratingsAverage: 4.5, ratingsQuantity: 42, images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop&q=60"], category: "home" },
  { _id: "d4", name: "Advanced Running Shoes", price: 129.99, ratingsAverage: 4.9, ratingsQuantity: 200, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"], category: "sports" },
];

const BRANDS = [
  { id: 1, name: "Apple" }, { id: 2, name: "Samsung" },
  { id: 3, name: "Sony" }, { id: 4, name: "Nike" },
  { id: 5, name: "Adidas" }, { id: 6, name: "LG" },
];

const CATS = [
  { id: "electronics", name: "Electronics", icon: "🔌", g: "from-blue-500 to-cyan-500" },
  { id: "clothing", name: "Clothing", icon: "👕", g: "from-purple-500 to-pink-500" },
  { id: "home", name: "Home", icon: "🏠", g: "from-green-500 to-emerald-500" },
  { id: "beauty", name: "Beauty", icon: "💄", g: "from-red-500 to-rose-500" },
  { id: "sports", name: "Sports", icon: "⚽", g: "from-orange-500 to-amber-500" },
  { id: "books", name: "Books", icon: "📚", g: "from-indigo-500 to-violet-500" },
];

const STATS = [
  { v: 10000, s: "+", l: "Happy Customers" },
  { v: 5000, s: "+", l: "Products Listed" },
  { v: 99, s: "%", l: "Satisfaction Rate" },
  { v: 24, s: "/7", l: "Expert Support" },
];

const FEATS = [
  { icon: "🚀", t: "Ultra Fast Delivery", d: "Get your orders within 24 hours" },
  { icon: "🛡️", t: "Secure Payments", d: "Bank-grade encryption protection" },
  { icon: "🎧", t: "24/7 Expert Support", d: "AI and human experts always here" },
];

/* Curated Grid Data - Will be populated dynamically */
let CURATED_GRIDS = [];

/* Fallback image to prevent broken UI */
const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%23111'%3E%3Crect width='400' height='400' rx='24'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23333' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading, error } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);

  const [settings, setSettings] = useState(null);
  const [flashSale, setFlashSale] = useState(null);
  const [trending, setTrending] = useState(null);
  const [catStats, setCatStats] = useState([]);
  const [setLoad, setSetLoad] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const progress = useProgress();
  const [isAtTop, setIsAtTop] = useState(true);
  const catScrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Hero Slideshow Logic ── */
  useEffect(() => {
    if (settings?.images?.length > 1) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % settings.images.length);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [settings?.images]);

  const nextHeroImage = useCallback(() => {
    if (settings?.images?.length > 1) {
      setHeroIndex((prev) => (prev + 1) % settings.images.length);
    }
  }, [settings?.images]);

  const prevHeroImage = useCallback(() => {
    if (settings?.images?.length > 1) {
      setHeroIndex((prev) => (prev === 0 ? settings.images.length - 1 : prev - 1));
    }
  }, [settings?.images]);

  /* ── Data Fetch (parallel) ── */
  useEffect(() => {
    dispatch(fetchProducts());

    const ctrl1 = new AbortController();
    const ctrl2 = new AbortController();

    (async () => {
      try {
        const { data } = await api.get("/settings", { signal: ctrl1.signal });
        if (data.status === "success") {
          startTransition(() => {
            setSettings(data.data.settings?.hero);
            setFlashSale(data.data.settings?.flashSale);
          });
        }
      } catch (e) {
        if (e.name !== "CanceledError") console.warn("Settings fetch failed", e.message);
      }
    })();

    (async () => {
      try {
        const { data } = await api.get("/products/trending", { signal: ctrl2.signal });
        if (data.status === "success") startTransition(() => setTrending(data.data.products));
      } catch (e) {
        if (e.name !== "CanceledError") console.warn("Trending fetch failed", e.message);
      } finally {
        startTransition(() => setSetLoad(false));
      }
    })();

    (async () => {
      try {
        const { data } = await api.get("/products/categories", { signal: ctrl1.signal });
        if (data.status === "success") startTransition(() => setCatStats(data.data.stats));
      } catch (e) {
        if (e.name !== "CanceledError") console.warn("Categories fetch failed", e.message);
      }
    })();

    return () => { ctrl1.abort(); ctrl2.abort(); };
  }, [dispatch]);

  /* ── Hero Entrance ── */
  useEffect(() => {
    if (!loading && !setLoad) {
      const id = requestAnimationFrame(() => setHeroReady(true));
      return () => cancelAnimationFrame(id);
    }
  }, [loading, setLoad]);

  /* ── Derived Data (memoized) ── */
  const real = useMemo(() => (products?.length > 0 ? products : []), [products]);
  const display = useDeferredValue(useMemo(() => (real.length > 0 ? real : []), [real]));
  const featured = useMemo(() => [...display].sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0)), [display]);
  const finalTrend = useMemo(() => (trending?.length > 0 ? trending : featured.slice(0, 8)), [trending, featured]);

  /* ── Dynamic Category Grids ── */
  const dynamicGrids = useMemo(() => {
    if (!catStats?.length || !real?.length) return [];

    // Group products by category
    const byCat = real.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {});

    // Create grids for top 4 categories
    return catStats.slice(0, 4).map(stat => {
      const catName = stat._id;
      const catProducts = byCat[catName] || [];
      
      return {
        title: `Popular in ${catName}`,
        exploreText: `Shop all ${catName}`,
        exploreLink: `/products?category=${catName}`,
        categories: catProducts.slice(0, 20).map(p => ({
          name: p.name,
          image: getProductImageUrl(p.images?.[0] || p.image),
          link: `/product/${p._id}`
        }))
      };
    }).filter(grid => grid.categories.length > 0);
  }, [catStats, real]);

  /* ── Handlers (stable refs) ── */
  const handleShopNow = useCallback((url) => {
    if (url) {
      if (url.startsWith('http')) {
        window.location.href = url;
      } else {
        navigate(url);
      }
    } else {
      navigate("/products");
    }
  }, [navigate]);

  const handleFlash = useCallback(() => {
    const pick = flashSale?._id ? flashSale : trending?.[0] || products?.[0];
    if (pick) {
      dispatch(addToCart({ ...pick, quantity: 1 }));
      // navigate("/cart"); // Removed auto-navigate to allow user to keep shopping
    } else {
      navigate("/products");
    }
  }, [flashSale, trending, products, dispatch, navigate]);

  const handleSubscribe = useCallback(async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      await api.post("/marketing/subscribe", { email });
      alert("Welcome to the club! 🚀");
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  }, []);

  const handleImgError = useCallback((e) => {
    if (e.target.src !== FALLBACK_IMG) e.target.src = FALLBACK_IMG;
  }, []);

  /* ── Hero stagger helper ── */
  const hs = useCallback(
    (d) => ({
      opacity: heroReady ? 1 : 0,
      transform: heroReady ? "none" : "translateY(32px)",
      transition: `opacity .9s ${EASE} ${d}ms, transform .9s ${EASE} ${d}ms`,
      willChange: heroReady ? "auto" : "opacity, transform",
    }),
    [heroReady]
  );

  /* ── RENDER DATA ── */
  const heroImg = useMemo(() => {
    if (settings?.images?.length > 0) {
      return getProductImageUrl(settings.images[heroIndex]);
    }
    return settings?.image
      ? getProductImageUrl(settings.image)
      : "https://images.unsplash.com/photo-1616469829718-0faf16324280?auto=format&fit=crop&q=80&w=1000";
  }, [settings, heroIndex]);

  /* ══════════ LOADING / ERROR ══════════ */
  if ((loading || setLoad) && !error) return <HomeSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
        <div className="glass p-8 rounded-3xl border border-red-500/20 text-center max-w-md">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Connection Issue</h2>
          <p className="text-secondary dark:text-gray-400 mb-6">We couldn&apos;t reach our servers. Please try refreshing.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-transform duration-300"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  /* ── RENDER ── */
  const flashImg = flashSale?.image ? getProductImageUrl(flashSale.image) : null;

  return (
    <>
      <SEO
        title="ShopHub.pro - Pakistan's #1 Luxury Online Shopping Store"
        description="ShopHub.pro - Buy ultra-premium electronics, fashion, and gadgets online in Pakistan at the best prices. Experience fast 24h delivery and cash on delivery."
        keywords="ShopHub.pro, luxury shopping Pakistan, online electronics store, social commerce Pakistan, video shopping app, premium fashion marketplace"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ShopHub.pro",
            "alternateName": ["ShopHub", "Shop Hub"],
            "url": "https://www.shophub.pro",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.shophub.pro/products?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ShopHub.pro",
            "url": "https://www.shophub.pro",
            "logo": "https://www.shophub.pro/logo.png",
            "sameAs": [
              "https://www.facebook.com/shophubpro",
              "https://www.instagram.com/shophubpro",
              "https://twitter.com/shophubpro"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+92-300-1234567",
              "contactType": "customer service",
              "areaServed": "PK",
              "availableLanguage": ["English", "Urdu"]
            }
          }
        ]}
      />

      {/* ── Scroll Progress Bar ── */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left pointer-events-none"
        style={{
          background: "linear-gradient(90deg,#06b6d4,#8b5cf6,#ec4899)",
          transform: `scaleX(${progress})`,
          willChange: "transform",
        }}
      />

      <div className="p-2 sm:p-4 md:p-6 min-h-screen">

        {/* ═══════════ HERO ═══════════ */}
        <section className="relative mb-20 md:mb-32 flex flex-col items-center overflow-hidden">
          {/* BG Glows — Desktop Only */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] -z-10 overflow-hidden hidden md:block pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/[0.025] dark:bg-purple-600/[0.07] rounded-full blur-[120px]" />
            <div className="absolute top-20 right-0 w-[500px] h-[400px] bg-cyan-500/[0.025] dark:bg-cyan-500/[0.07] rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-pink-500/[0.02] dark:bg-pink-500/[0.06] rounded-full blur-[100px]" />
          </div>
          <Particles />

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0 md:pt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 items-center">

              {/* ── Left: Text ── */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.025] dark:bg-white/[0.025] border border-black/[0.05] dark:border-white/[0.05] backdrop-blur-xl mb-8 cursor-default transition-all duration-500 hover:scale-105 hover:border-cyan-500/20 dark:hover:border-cyan-500/20"
                  style={hs(80)}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                  </span>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.18em] text-primary dark:text-gray-200 uppercase">
                    New Collection Live
                  </span>
                </div>

                {/* Heading */}
                <h1
                  className="text-[clamp(2.5rem,8vw,7rem)] font-black text-primary dark:text-white leading-[0.9] tracking-[-0.04em] mb-6"
                  style={hs(180)}
                >
                  {settings?.title?.split(" ").slice(0, -1).join(" ") || "Elevate"}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-[length:200%_auto] animate-grad">
                    {settings?.title?.split(" ").slice(-1) || "Lifestyle"}
                  </span>
                </h1>

                {/* Subtitle */}
                <p
                  className="text-base sm:text-lg md:text-xl text-secondary dark:text-gray-400 font-medium max-w-lg mb-10 leading-relaxed"
                  style={hs(320)}
                >
                  {settings?.subtitle ||
                    "Discover ultra-premium products curated for excellence. Fast, beautiful, and designed exclusively for your unique taste."}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10" style={hs(460)}>
                  <button
                    onClick={() => handleShopNow(settings?.productUrl || settings?.buttonLink)}
                    className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(255,255,255,0.06)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white dark:text-black group-hover:text-white transition-colors duration-400">
                      {settings?.buttonText || "Start Shopping"}
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </button>
                  <Link
                    to="/categories"
                    className="group px-8 py-4 bg-black/[0.025] dark:bg-white/[0.025] border border-black/[0.07] dark:border-white/[0.07] text-primary dark:text-white font-bold rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Explore Categories
                  </Link>
                </div>

                {/* Trust */}
                <div
                  className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium text-secondary dark:text-gray-400 bg-white/60 dark:bg-white/[0.015] p-4 rounded-3xl border border-black/[0.035] dark:border-white/[0.035] backdrop-blur-xl"
                  style={hs(600)}
                >
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-[#111] object-cover"
                        src={`https://i.pravatar.cc/100?img=${i}`}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={40}
                        height={40}
                      />
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#111] bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 flex items-center justify-center text-[9px] font-bold text-cyan-700 dark:text-cyan-300">
                      +10k
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex text-yellow-500 text-sm gap-0.5">{"★".repeat(5)}</div>
                    <span className="text-[10px] uppercase tracking-[0.15em] mt-0.5 font-bold">
                      Trusted Customers
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Right: Visual ── */}
              <div
                className="relative w-full h-auto md:h-[600px] flex items-center justify-center mt-0"
                style={{
                  opacity: heroReady ? 1 : 0,
                  transform: heroReady ? "none" : "translateY(44px) scale(0.96)",
                  transition: `opacity 1.1s ${EASE} 350ms, transform 1.1s ${EASE} 350ms`,
                  willChange: heroReady ? "auto" : "opacity, transform",
                }}
              >
                <div className="relative w-full h-[280px] sm:h-[400px] md:h-[600px] max-w-lg md:max-w-none flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[480px] md:h-[480px] bg-gradient-to-tr from-cyan-200/40 to-purple-200/40 dark:from-cyan-900/25 dark:to-purple-900/25 rounded-full blur-[90px]" />
                  
                  {settings?.video ? (
                    <video
                      src={getProductImageUrl(settings.video)}
                      className="w-[95%] h-[95%] object-cover relative z-10 rounded-3xl shadow-2xl"
                      autoPlay muted loop playsInline
                      onError={handleImgError}
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center group/slider">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={heroIndex}
                          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          src={heroImg}
                          alt="Premium product"
                          className="w-[85%] h-[85%] object-contain relative z-10 hover:scale-[1.02] transition-transform duration-1000"
                          loading="eager"
                          fetchpriority="high"
                          decoding="sync"
                          onError={handleImgError}
                        />
                      </AnimatePresence>
                      
                      {settings?.images?.length > 1 && (
                        <>
                          <button 
                            onClick={prevHeroImage}
                            className="absolute left-2 md:-left-4 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-primary dark:text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/20 hover:scale-110"
                            aria-label="Previous image"
                          >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                          </button>
                          <button 
                            onClick={nextHeroImage}
                            className="absolute right-2 md:-right-4 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-primary dark:text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/20 hover:scale-110"
                            aria-label="Next image"
                          >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-2 right-0 sm:bottom-10 sm:right-6 md:right-10 md:bottom-20 z-20 anim-float scale-[0.85] sm:scale-100 origin-bottom-right">
                  <div className="bg-white/80 dark:bg-black/60 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-black/[0.035] dark:border-white/[0.06] flex items-center gap-4 hover:scale-105 transition-transform duration-500 cursor-default shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/20">
                      %
                    </div>
                    <div>
                      <p className="text-[10px] text-secondary dark:text-gray-500 uppercase tracking-[0.15em] font-bold">
                        Special Offer
                      </p>
                      <p className="text-xl font-black text-primary dark:text-white leading-none mt-1">
                        {settings?.price || "50%"} OFF
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Interactive Scroll Down Button */}
          <div
            className={`absolute bottom-2 md:bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-700 ease-in-out ${isAtTop && heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
          >
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
              className="flex flex-col items-center gap-3 group cursor-pointer"
              aria-label="Scroll down to explore"
            >
              <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.1] p-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-translate-y-1 group-active:scale-95 transition-all duration-300">
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-secondary dark:text-gray-500 group-hover:text-primary dark:group-hover:text-white transition-colors duration-300">
                Scroll to Explore
              </span>
            </button>
          </div>
        </section>

        {/* Stats moved to Newsletter section */}

        {/* ── Banner Ad ── */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <GoogleAd slot="5177022241" format="auto" responsive="true" />
        </div>

        {/* ═══════════ CURATED GRIDS ═══════════ */}
        {dynamicGrids.length > 0 && (
          <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dynamicGrids.map((grid, idx) => (
                <Reveal key={idx} delay={idx * 100}>
                  <CategoryGrid 
                    title={grid.title}
                    categories={grid.categories}
                    exploreText={grid.exploreText}
                    exploreLink={grid.exploreLink}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════ FEATURED ═══════════ */}
        <Reveal className="mb-24 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4 border-b border-black/[0.035] dark:border-white/[0.035] pb-4">
            <div>
              <span className="text-cyan-600 dark:text-cyan-500 font-mono text-[11px] tracking-[0.18em] uppercase mb-2 block">
                Premium Selection
              </span>
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-primary dark:text-white tracking-tight">
                Featured Collection
              </h2>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-2 text-secondary dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors duration-300 text-sm font-medium pb-1"
            >
              View All Products
              <div className="w-7 h-7 rounded-full bg-black/[0.025] dark:bg-white/[0.025] flex items-center justify-center group-hover:bg-black/[0.07] dark:group-hover:bg-white/[0.07] transition-all duration-300 group-hover:translate-x-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          </div>
          <ProductList products={featured} loading={loading} error={error} itemsPerPage={8} />
          {real.length === 0 && user?.role === "admin" && (
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm mb-2">Showing demo products — database is empty.</p>
              <Link to="/admin" className="text-purple-400 hover:text-purple-300 text-sm underline underline-offset-4 transition-colors duration-300">
                Add Real Products
              </Link>
            </div>
          )}
        </Reveal>

        {/* ═══════════ BEST SELLERS SLIDER ═══════════ */}
        <Reveal className="mb-20 md:mb-32">
           <ProductSlider 
              title="Best Sellers in Technology & Fashion"
              products={featured}
              loading={loading}
           />
        </Reveal>

        {/* ═══════════ TRENDING ═══════════ */}
        <Reveal className="mb-24 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 border-b border-black/[0.035] dark:border-white/[0.035] pb-4">
            <div>
              <span className="text-purple-600 dark:text-purple-500 font-mono text-[11px] tracking-[0.18em] uppercase mb-2 block">
                Hot Picks
              </span>
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-primary dark:text-white tracking-tight">
                Trending Now
              </h2>
            </div>
          </div>
          <Stagger className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" gap={70}>
            {finalTrend.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </Stagger>
        </Reveal>

        {/* ═══════════ CATEGORIES ═══════════ */}
        <Reveal className="mb-24 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2 block text-gray-400 dark:text-gray-600">
              Browse
            </span>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-primary dark:text-white tracking-tight">
              Shop by Category
            </h2>
          </div>
          <div className="relative group/catslider px-2">
            <button
              onClick={() => {
                if(catScrollRef.current) catScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
              }}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-black border border-black/[0.05] dark:border-white/[0.05] rounded-full flex items-center justify-center text-primary dark:text-white shadow-xl opacity-0 group-hover/catslider:opacity-100 hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div 
              ref={catScrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar pb-6 pt-2 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CATS.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${c.id}`}
                  className="flex-shrink-0 w-32 md:w-44 snap-start group relative h-32 md:h-40 rounded-2xl md:rounded-[2rem] overflow-hidden bg-white dark:bg-white/[0.015] border border-black/[0.05] dark:border-white/[0.05] hover:border-transparent dark:hover:border-transparent transition-all duration-500 hover:-translate-y-2 shadow-sm hover:shadow-2xl"
                  style={{ contain: "layout style paint" }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${c.g} opacity-0 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.12] transition-opacity duration-500`}
                  />
                  <div
                    className={`absolute -inset-px rounded-2xl md:rounded-[2rem] bg-gradient-to-br ${c.g} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md`}
                  />
                  <div className="flex flex-col items-center justify-center h-full relative z-10 p-2 text-center">
                    <span className="text-4xl md:text-5xl mb-3 grayscale-[40%] group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-3 drop-shadow-md">
                      {c.icon}
                    </span>
                    <h3 className="text-xs md:text-sm font-bold text-secondary dark:text-gray-500 group-hover:text-primary dark:group-hover:text-white transition-colors duration-300 tracking-tight">
                      {c.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                if(catScrollRef.current) catScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
              }}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-black border border-black/[0.05] dark:border-white/[0.05] rounded-full flex items-center justify-center text-primary dark:text-white shadow-xl opacity-0 group-hover/catslider:opacity-100 hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </Reveal>

        {/* ═══════════ FLASH SALE ═══════════ */}
        <Reveal className="mb-12 sm:mb-20" dir="scale">
          <section
            className="relative rounded-[2rem] overflow-hidden border border-black/[0.035] dark:border-white/[0.05] shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] group min-h-[500px] flex items-center"
            style={{ contain: "layout style paint" }}
          >
            {/* BG Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/15 dark:to-black z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(220,38,38,0.03),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_20%_50%,rgba(220,38,38,0.12),transparent_60%)]" />
            <div
              className="absolute inset-0 opacity-[0.012] dark:opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "128px",
              }}
            />

            <div className="relative z-10 p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full">
              {/* Text */}
              <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 w-full">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-4 mb-6">
                  <span className="bg-red-600 text-white text-[10px] font-bold tracking-[0.14em] px-4 py-1.5 rounded-full shadow-lg shadow-red-600/20">
                    FLASH SALE
                  </span>
                  <CountdownTimer />
                </div>

                <h2 className="text-[clamp(2rem,6vw,3.75rem)] font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 dark:from-white dark:to-red-200 leading-[0.95] tracking-tight">
                  {flashSale?.title || "Sonic X-Pro"}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-secondary dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                  {flashSale?.subtitle || "Active Noise Cancelling, 30-hour battery life, and ultra-comfortable earcups."}
                </p>

                <div className="flex flex-col w-full sm:w-auto gap-4">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <div className="text-3xl sm:text-4xl font-black text-primary dark:text-white">
                      {formatPrice(flashSale?.price || 199.99)}
                    </div>
                    <div className="text-lg text-gray-400 line-through decoration-red-500/40 decoration-2">
                      {formatPrice(flashSale?.originalPrice || 399.99)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() => handleShopNow(flashSale?.productUrl)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(220,38,38,0.18)] dark:shadow-[0_4px_30px_rgba(220,38,38,0.25)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.3)] text-base transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      ⚡ Shop Now
                    </button>
                    <button
                      onClick={handleFlash}
                      aria-label="Add flash sale item to cart"
                      className="flex-1 bg-black/[0.025] dark:bg-white/[0.025] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-primary dark:text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 border border-black/[0.07] dark:border-white/[0.07] text-base transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="md:w-1/2 flex justify-center relative order-1 md:order-2 w-full mb-8 md:mb-0">
                <div className="absolute inset-0 bg-red-500/[0.025] dark:bg-red-600/[0.06] blur-[40px] rounded-full scale-75" />
                <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-[2.5rem] flex items-center justify-center border border-black/[0.035] dark:border-white/[0.05] relative z-10 overflow-hidden bg-white/50 dark:bg-black/20 group-hover:scale-[1.03] transition-transform duration-700 ease-out shadow-sm dark:shadow-lg skew-y-2 group-hover:skew-y-0">
                  {flashImg ? (
                    <img
                      src={flashImg}
                      alt={flashSale?.title || "Flash Sale"}
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      onError={handleImgError}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-6xl mb-4 block">🎧</span>
                      <span className="text-gray-400 text-xs tracking-[0.18em] uppercase font-bold">
                        Sonic X-Pro
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ═══════════ PREMIUM BRANDS MARQUEE ═══════════ */}
        <div className="mb-24 overflow-hidden relative py-10">
           <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 dark:from-black to-transparent z-10 pointer-events-none"></div>
           <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 dark:from-black to-transparent z-10 pointer-events-none"></div>
           
           <div className="flex animate-marquee whitespace-nowrap gap-8 hover:pause">
              {[...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
                <div
                  key={`${b.id}-${i}`}
                  className="inline-flex items-center justify-center px-10 py-6 rounded-[2rem] bg-white/40 dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-500 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 min-w-[200px]"
                >
                  <span className="text-xl md:text-2xl font-black text-secondary dark:text-gray-500 group-hover:text-primary dark:group-hover:text-white transition-all duration-500 tracking-[0.1em] uppercase italic">
                    {b.name}
                  </span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-1/2 transition-all duration-500 rounded-full"></div>
                </div>
              ))}
           </div>
        </div>

        {/* ═══════════ REVIEWS ═══════════ */}
        <ReviewMarquee />

        {/* ═══════════ NEWSLETTER + FEATURES ═══════════ */}
        <Reveal className="mb-12" dir="scale">
          <section
            className="relative rounded-[2rem] overflow-hidden p-8 sm:p-12 md:p-20 text-center glass shadow-[0_20px_60px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            style={{ contain: "layout style paint" }}
          >
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0a0a0a] dark:to-black" />
            <div
              className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "128px",
              }}
            />

            <div className="relative z-10 max-w-5xl mx-auto">
              {/* Features */}
              <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-16 md:mb-20" gap={100}>
                {FEATS.map((f) => (
                  <div key={f.t} className="flex flex-col items-center group">
                    <div className="w-16 h-16 rounded-2xl bg-black/[0.025] dark:bg-white/[0.025] border border-black/[0.035] dark:border-white/[0.035] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-cyan-500/20 dark:group-hover:border-cyan-500/20 transition-all duration-500">
                      <span className="text-2xl">{f.icon}</span>
                    </div>
                    <h3 className="text-base font-bold text-primary dark:text-white mb-1.5 tracking-tight">
                      {f.t}
                    </h3>
                    <p className="text-secondary dark:text-gray-500 text-[11px] uppercase tracking-[0.14em] font-medium">
                      {f.d}
                    </p>
                  </div>
                ))}
              </Stagger>

              {/* Newsletter */}
              <h2 className="text-[clamp(1.75rem,5vw,3rem)] md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600 dark:from-purple-400 dark:via-cyan-400 dark:to-purple-400 bg-[length:200%_auto] animate-grad tracking-tight">
                Join the Inner Circle
              </h2>
              <p className="text-base md:text-lg text-secondary dark:text-gray-400 mb-10">
                Get early access to drops, exclusive discounts, and future-tech news.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto relative z-20"
              >
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow bg-white dark:bg-white/[0.025] border border-black/[0.07] dark:border-white/[0.07] px-6 py-4 rounded-2xl text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-gray-50 dark:focus:bg-white/[0.04] transition-all duration-300 font-medium text-sm"
                  required
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="bg-black dark:bg-white text-white dark:text-black font-bold px-8 py-4 rounded-2xl hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>

              {/* ═══════════ STATS ═══════════ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-16 md:mt-20">
                {STATS.map((s) => (
                  <div
                    key={s.l}
                    className="text-center p-5 md:p-8 rounded-3xl bg-white/50 dark:bg-white/[0.015] border border-black/[0.035] dark:border-white/[0.035] backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/[0.03] transition-all duration-500 group cursor-default"
                    style={{ contain: "layout style paint" }}
                  >
                    <div className="text-3xl md:text-5xl font-black text-primary dark:text-white tracking-tight mb-1.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-500">
                      <CountUp target={s.v} suffix={s.s} />
                    </div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.16em] font-bold text-secondary dark:text-gray-500">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ═══════════ MARQUEE ═══════════ */}
        <Reveal className="mb-12 overflow-hidden relative py-12">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-cyan-500/[0.025] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-purple-500/[0.025] rounded-full blur-[120px] pointer-events-none" />

          <div className="mb-12 text-center px-4">
            <h2 className="text-[clamp(1.75rem,5vw,3rem)] md:text-4xl font-black text-primary dark:text-white mb-3 tracking-[-0.02em] uppercase">
              Global <span className="text-cyan-600 dark:text-cyan-400 italic">Favorites</span>
            </h2>
            <div className="h-[2px] w-20 bg-gradient-to-r from-cyan-400 via-purple-500 to-transparent mx-auto rounded-full mb-4" />
            <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.28em] font-medium">
              Top Trending Products Across 50+ Countries
            </p>
          </div>

          <div className="relative group/mq">
            {/* Edge Fades */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-white dark:from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-white dark:from-[#050505] to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-scroll group-hover/mq:[animation-play-state:paused] will-change-transform py-4">
              {[...display, ...display, ...display].map((p, idx) => {
                const price = p.discountPercentage > 0
                  ? p.price * (1 - p.discountPercentage / 100)
                  : p.price;
                const origPrice = p.discountPercentage > 0 ? p.price : null;
                const img = getProductImageUrl(p.images?.[0] || p.image);

                return (
                  <Link
                    key={`${p._id || idx}-${idx}`}
                    to={`/product/${p._id}`}
                    className="w-44 md:w-60 mx-2.5 md:mx-3.5 flex-shrink-0 flex flex-col bg-white/60 dark:bg-white/[0.015] border border-black/[0.035] dark:border-white/[0.035] rounded-2xl md:rounded-[1.5rem] p-3 md:p-4 hover:bg-white/90 dark:hover:bg-white/[0.04] hover:border-black/[0.07] dark:hover:border-white/[0.07] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)] relative group/c"
                    style={{ contain: "layout style paint" }}
                  >
                    <div className="w-full aspect-square md:h-44 rounded-xl md:rounded-2xl overflow-hidden mb-3 relative bg-black/[0.02] dark:bg-black/20">
                      <img
                        src={img}
                        alt={p.name}
                        className="w-full h-full object-cover scale-100 group-hover/c:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover/c:opacity-100"
                        loading="lazy"
                        decoding="async"
                        onError={handleImgError}
                        width={240}
                        height={240}
                      />
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-xl border border-white/10 px-2 py-0.5 rounded-lg text-[7px] font-bold text-cyan-400 uppercase tracking-[0.12em] opacity-0 group-hover/c:opacity-100 transition-opacity duration-300">
                        Popular
                      </div>
                    </div>
                    <div className="px-0.5">
                      <h3 className="text-[11px] md:text-xs font-bold text-primary dark:text-white line-clamp-1 group-hover/c:text-cyan-600 dark:group-hover/c:text-cyan-400 transition-colors duration-300 uppercase tracking-tight">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex flex-col">
                          {origPrice !== null && (
                            <span className="text-[9px] text-gray-400 line-through font-medium leading-none">
                              {formatPrice(origPrice, p.currency)}
                            </span>
                          )}
                          <p className="text-cyan-600 dark:text-cyan-400 font-black text-xs md:text-sm leading-tight">
                            {formatPrice(price, p.currency)}
                          </p>
                        </div>
                        <div className="text-[9px] text-gray-400 font-bold flex items-center gap-0.5">
                          <span className="text-yellow-500">★</span>
                          {p.ratingsAverage || "5.0"}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ═══════════ GLOBAL STYLES — Critical Only ═══════════ */}
      <style>{`
        @keyframes pf {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          33% { transform: translateY(-12px) translateX(3px); opacity: 0.5; }
          66% { transform: translateY(-5px) translateX(-2px); opacity: 0.35; }
        }
        @keyframes fls {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes grad {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .anim-float { animation: fls 4s ease-in-out infinite; }
        .animate-grad { animation: grad 5s ease infinite; }
        html { scroll-behavior: smooth; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        .dark ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
        .dark ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }

        /* Selection */
        ::selection { background: rgba(6,182,212,0.15); }
        .dark ::selection { background: rgba(6,182,212,0.25); }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
          .animate-scroll { animation: none !important; }
        }
      `}</style>
    </>
  );
}