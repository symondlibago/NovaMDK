import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ThemeProvider from "./theme/ThemeContext";
import ScrollToTop from "./components/Nav/ScrollToTop";
import { trackPageView } from "./lib/analytics";
import SmoothScroll from "./components/SmoothScroll";
import RouteTransition from "./components/transition/RouteTransition";
import DesignStudio from "./components/studio/DesignStudio";
import Platform from "./pages/Platform";
import TreatmentsPage from "./pages/Treatments";
import SupplementsPage from "./pages/Supplements";
import ContactPage from "./pages/Contact";
import KioskPage from "./pages/Kiosk";
import Consult from "./pages/Consult";
import ProductPage from "./pages/ProductPage";
import LegalPage from "./components/LegalPage";
import KioskAttractLoop from "./components/kiosk/KioskAttractLoop";

// Fires a single page_view per route change (pathname only — no query noise).
function RouteAnalytics() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SmoothScroll />
        <ScrollToTop />
        <RouteAnalytics />
        <RouteTransition />
        <Routes>
          <Route path="/" element={<Platform />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/supplements" element={<SupplementsPage />} />
          <Route path="/kiosk" element={<KioskPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/start" element={<Consult />} />
          <Route path="/start/:slug" element={<Consult />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/legal/:policyId" element={<LegalPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <DesignStudio />
        <KioskAttractLoop />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
