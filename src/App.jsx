import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ThemeProvider from "./theme/ThemeContext";
import ScrollToTop from "./components/Nav/ScrollToTop";
import SmoothScroll from "./components/SmoothScroll";
import RouteTransition from "./components/transition/RouteTransition";
import DesignStudio from "./components/studio/DesignStudio";
import Platform from "./pages/Platform";
import TreatmentsPage from "./pages/Treatments";
import SupplementsPage from "./pages/Supplements";
import ContactPage from "./pages/Contact";
import LegalPage from "./components/LegalPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SmoothScroll />
        <ScrollToTop />
        <RouteTransition />
        <Routes>
          <Route path="/" element={<Platform />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/supplements" element={<SupplementsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal/:policyId" element={<LegalPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <DesignStudio />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
