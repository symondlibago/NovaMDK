import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const TikTokIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.55a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.0z" />
  </svg>
);

const social = "grid h-10 w-10 place-items-center rounded-full bg-white/10 text-on-panel transition-colors hover:bg-accent hover:text-panel";

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-panel pb-10 pt-16 text-on-panel/75 md:pt-24">
      <div className="mx-auto max-w-[1340px] px-6 md:px-10">
        <div className="mb-12 grid grid-cols-1 gap-10 md:mb-20 md:grid-cols-4 lg:gap-16">
          <div className="md:col-span-2 lg:col-span-1 md:pr-8">
            <span className="inline-flex w-fit rounded-2xl bg-surface px-5 py-3.5 nv-shadow">
              <img src="/logo.png" alt="NovaMDK" className="h-[42px] w-auto" />
            </span>
            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-on-panel/60">
              Personalized supplements and treatments, formulated by licensed physicians and delivered to your door.
            </p>
            <div className="mb-8 mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs">
              <span className="font-medium text-on-panel">4.8</span>
              <span className="tracking-tighter text-accent">★★★★★</span>
              <span className="text-on-panel/60">12,000+ reviews</span>
            </div>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/novamdk" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={social}><Facebook size={18} strokeWidth={1.5} /></a>
              <a href="https://www.instagram.com/novamdk" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}><Instagram size={18} strokeWidth={1.5} /></a>
              <a href="https://www.tiktok.com/@novamdk" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={social}><TikTokIcon size={18} /></a>
              <a href="https://x.com/novamdk" target="_blank" rel="noopener noreferrer" aria-label="X" className={social}><Twitter size={18} strokeWidth={1.5} /></a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent md:mb-6">Treatments</h4>
            <ul className="space-y-3 text-[14px] text-on-panel/60 md:space-y-4">
              <li><Link to="/treatments" className="transition-colors hover:text-on-panel">All Treatments</Link></li>
              <li><Link to="/supplements" className="transition-colors hover:text-on-panel">Supplements</Link></li>
              <li><Link to="/treatments" className="transition-colors hover:text-on-panel">Weight Loss</Link></li>
              <li><Link to="/treatments" className="transition-colors hover:text-on-panel">Sports Medicine</Link></li>
              <li><Link to="/treatments" className="transition-colors hover:text-on-panel">Men's Health</Link></li>
              <li><Link to="/treatments" className="transition-colors hover:text-on-panel">Women's Health</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent md:mb-6">Company</h4>
            <ul className="space-y-3 text-[14px] text-on-panel/60 md:space-y-4">
              <li><Link to="/#how" className="transition-colors hover:text-on-panel">How it works</Link></li>
              <li><Link to="/#why" className="transition-colors hover:text-on-panel">Why people stay</Link></li>
              <li><Link to="/#reviews" className="transition-colors hover:text-on-panel">Reviews</Link></li>
              <li><Link to="/#faq" className="transition-colors hover:text-on-panel">FAQ</Link></li>
              <li><Link to="/treatments" className="transition-colors hover:text-on-panel">Treatments</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-on-panel">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent md:mb-6">Legal</h4>
            <ul className="space-y-3 text-[14px] text-on-panel/60 md:space-y-4">
              <li><Link to="/legal/privacy-policy" className="transition-colors hover:text-on-panel">Privacy policy</Link></li>
              <li><Link to="/legal/terms-and-conditions" className="transition-colors hover:text-on-panel">Terms &amp; conditions</Link></li>
              <li><Link to="/legal/telehealth-consent" className="transition-colors hover:text-on-panel">Telehealth consent</Link></li>
              <li><Link to="/legal/consumer-health-data" className="transition-colors hover:text-on-panel">Consumer Health Data</Link></li>
              <li><Link to="/legal/sitemap" className="transition-colors hover:text-on-panel">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-[13px] text-on-panel/50 md:flex-row md:items-center md:justify-between md:pt-10">
          <p>©2026 NovaMD Inc. All rights reserved.</p>
          <p>Made for your body — not the average.</p>
        </div>

        <p className="mt-8 max-w-6xl text-left text-[10px] leading-relaxed text-on-panel/40 md:text-[11px]">
          Prescription products require an online evaluation by a licensed medical professional. Medications are prescribed by licensed physicians as part of our programs, and actual product packaging may vary. The FDA does not review compounded medications for safety or effectiveness. For prescription items, NovaMD will arrange a consultation with a qualified healthcare provider.
        </p>
      </div>
    </footer>
  );
}
