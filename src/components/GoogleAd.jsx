import { useEffect } from "react";

const GoogleAd = ({ 
  slot, 
  layout = "", 
  format = "auto", 
  responsive = "true",
  style = { display: "block", textAlign: "center" },
  className = "ad-container my-12 w-full flex justify-center overflow-hidden rounded-3xl border border-black/[0.03] dark:border-white/[0.03] bg-black/[0.01] dark:bg-white/[0.01] p-4"
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silently catch AdSense errors (e.g. ad-blocker)
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-layout={layout || undefined}
        data-ad-format={format}
        data-ad-client="ca-pub-6521940579323633"
        data-ad-slot={slot}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default GoogleAd;
