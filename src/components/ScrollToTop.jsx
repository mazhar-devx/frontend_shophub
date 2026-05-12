import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component automatically scrolls the window to the top (0,0)
 * whenever the route (pathname) changes. This ensures a consistent user experience
 * where new pages always start from the top rather than preserving previous scroll positions.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the very top with smooth behavior for better feel
    // Or instant behavior if preferred for fast navigation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Using instant for immediate top-of-page visibility
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
