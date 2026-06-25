import { useState, useEffect } from "react";
export const KIOSK_MQ = "(min-width: 600px) and (max-width: 1024px) and (orientation: portrait)";

export default function useKioskMode() {
  const read = () => {
    if (typeof window === "undefined") return false;
    if (new URLSearchParams(window.location.search).has("kiosk")) return true;
    return window.matchMedia(KIOSK_MQ).matches;
  };

  const [kiosk, setKiosk] = useState(read);
  useEffect(() => {
    const mq = window.matchMedia(KIOSK_MQ);
    const onChange = () => setKiosk(read());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return kiosk;
}
