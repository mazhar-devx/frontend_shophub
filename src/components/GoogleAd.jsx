import { useEffect, useRef, useState } from "react";

const GoogleAd = ({ 
  slot, 
  layout, 
  format, 
  responsive = "true",
  className = "ad-container my-8 w-full flex justify-center overflow-hidden"
}) => {
  const adRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement) return;

    // Mutation observer to detect when AdSense modifies the 'ins' tag
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
          const status = adElement.getAttribute('data-ad-status');
          if (status === 'filled') {
            setIsVisible(true);
          } else if (status === 'unfilled') {
            setIsVisible(false);
          }
        }
      });
    });

    observer.observe(adElement, { attributes: true });

    // Initial push
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          if (adElement.getAttribute('data-adsbygoogle-status') !== 'done') {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        console.warn('[ShopHub Ads] AdSense push error:', e.message);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      className={`${className} ${isVisible ? 'block' : 'hidden'}`}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <div className="w-full rounded-2xl border border-white/5 bg-white/5 p-4">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center", width: "100%" }}
          {...(layout ? { "data-ad-layout": layout } : {})}
          data-ad-format={format || "fluid"}
          data-ad-client="ca-pub-6521940579323633"
          data-ad-slot={slot}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
};

export default GoogleAd;
