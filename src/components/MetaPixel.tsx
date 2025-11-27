import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export default function MetaPixel() {
  const location = useLocation();
  const firstLoad = useRef(true);

  useEffect(() => {
    // Skip the first load as it's handled by the script in index.html
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    // Track PageView on route changes
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null;
}