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
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consentStr = localStorage.getItem('cookie-consent');
      if (consentStr) {
        try {
          const consent = JSON.parse(consentStr);
          setHasConsent(consent.marketing);
        } catch (e) {
          setHasConsent(false);
        }
      } else {
        setHasConsent(false);
      }
    };
    
    checkConsent();
    window.addEventListener('cookie-consent-updated', checkConsent);
    return () => window.removeEventListener('cookie-consent-updated', checkConsent);
  }, []);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement || !hasConsent) return;

    let pushed = false;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !pushed) {
        pushed = true;
        try {
          if (typeof window !== 'undefined' && window.adsbygoogle) {
            if (adElement.getAttribute('data-adsbygoogle-status') !== 'done') {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
          }
        } catch (e) {
          console.warn('[ShopHub Ads] AdSense push error:', e.message);
        }
        intersectionObserver.unobserve(adElement);
      }
    }, { threshold: 0.1 });

    intersectionObserver.observe(adElement);

    // Mutation observer to detect when AdSense modifies the 'ins' tag
    const statusObserver = new MutationObserver((mutations) => {
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

    statusObserver.observe(adElement, { attributes: true });

    return () => {
      intersectionObserver.disconnect();
      statusObserver.disconnect();
    };
  }, []);

  if (!hasConsent) return null;

  return (
    <div 
      className={`${className} transition-all duration-700 ease-in-out`}
      style={{ 
        visibility: isVisible ? 'visible' : 'hidden',
        height: isVisible ? 'auto' : '0px',
        opacity: isVisible ? 1 : 0,
        margin: isVisible ? '2rem 0' : '0px',
        pointerEvents: isVisible ? 'auto' : 'none',
        display: isVisible ? 'flex' : 'block', // Use block when 0 height to avoid flex gaps
        overflow: 'hidden'
      }}
    >
      <div className={`w-full rounded-2xl border border-white/5 bg-white/5 shadow-2xl ${isVisible ? 'p-4' : 'p-0'}`}>
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
