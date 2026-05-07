import { useEffect } from "react";

const GoogleAd = ({ 
  slot, 
  layout, 
  format, 
  responsive = "true",
  className = "ad-container my-8 w-full flex justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4"
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silently catch AdSense errors
    }
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
