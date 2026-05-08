import { useEffect } from "react";

const GoogleAd = ({ 
  slot, 
  layout, 
  format, 
  responsive = "true",
  className = "ad-container my-8 w-full flex justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4"
}) => {
  useEffect(() => {
    // Add a small delay to ensure the DOM element is fully rendered
    const timer = setTimeout(() => {
      try {
        // Ensure we only push if the ad hasn't been initialized yet
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
          if (ads.length > 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        console.warn('[ShopHub Ads] AdSense push error:', e.message);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center", minWidth: "250px", minHeight: "90px", width: "100%" }}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-ad-format={format || "fluid"}
        data-ad-client="ca-pub-6521940579323633"
        data-ad-slot={slot}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default GoogleAd;
