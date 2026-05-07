import { useEffect } from "react";

const GoogleAd = ({ slot, layout = "in-article", format = "fluid" }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="ad-container my-8 w-full flex justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center", minWidth: "250px", minHeight: "90px" }}
        data-ad-layout={layout}
        data-ad-format={format}
        data-ad-client="ca-pub-6521940579323633"
        data-ad-slot={slot}
      />
    </div>
  );
};

export default GoogleAd;
