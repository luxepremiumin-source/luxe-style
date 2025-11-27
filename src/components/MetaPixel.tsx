import { useEffect } from "react";
import { useLocation } from "react-router";

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

export default function MetaPixel() {
  const location = useLocation();

  useEffect(() => {
    if (!PIXEL_ID) return;

    // Initialize Facebook Pixel
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
  }, []);

  useEffect(() => {
    if (!PIXEL_ID) return;
    window.fbq('track', 'PageView');
  }, [location]);

  return null;
}