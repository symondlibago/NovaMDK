import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";
import { getLenis } from "../../lib/smoothScroll";

const EASE = [0.16, 1, 0.3, 1];

// Mirror the real treatment categories (see data/consultations.jsx). Each item
// deep-links to that goal's shoppable catalog — keep in sync with the footer.
const treatmentItems = [
  { name: "Weight Loss", img: "/supplementpill.avif", link: "/treatments?goal=weight-loss" },
  { name: "Anti-Aging", img: "/antipill.avif", link: "/treatments?goal=unisex-anti-aging-rx" },
  { name: "Skin Health", img: "/womenpill.avif", link: "/treatments?goal=unisex-skin-health" },
  { name: "Sexual Health", img: "/menpill.avif", link: "/treatments?goal=mens-health" },
  { name: "Sports Medicine", img: "/sportpill.avif", link: "/treatments?goal=unisex-sports-medicine" },
];

/* Peptide molecule list HIDDEN at client request (2026-06-20). "Supplements" is a
   plain link for now; restore this array + the NavDropdown/MobileGroup to bring the
   peptide menu back.
const supplementItems = [
  { name: "Semaglutide", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "Tirzepatide", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "Retatrutide (GLP-3)", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "BPC-157", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "NAD+", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "GHK-Cu", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "Thymosin Alpha 1", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "MOTS-C", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "IGF-1-LR3", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "Tesamorelin", img: "/luvirasupplement.avif", link: "/supplements" },
  { name: "Glow Blend", img: "/luvirasupplement.avif", link: "/supplements" },
];
*/

/* --------------------------- desktop dropdown --------------------------- */
function NavDropdown({ title, items, viewAllLink }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button aria-expanded={open} className="flex items-center gap-1.5 py-2 text-[15px] font-medium text-muted transition-colors hover:text-ink">
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="opacity-50" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 mt-2 max-h-[72vh] w-[330px] -translate-x-1/2 overflow-y-auto rounded-3xl border border-line bg-surface p-2.5 nv-shadow-lg nv-scroll"
          >
            <Link
              to={viewAllLink}
              onClick={() => setOpen(false)}
              className="group mb-2 flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 text-[15px] font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-surface">
                  <img src={items[0]?.img} className="h-full w-full scale-[1.15] object-contain mix-blend-multiply transition-transform group-hover:scale-[1.3]" alt="" />
                </span>
                View all {title.toLowerCase()}
              </span>
              <ArrowRight size={18} />
            </Link>
            <ul className="space-y-0.5">
              {items.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.link}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between rounded-2xl px-4 py-2.5 transition-colors hover:bg-surface-2"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg">
                        <img src={item.img} className="h-full w-full scale-[1.15] object-contain mix-blend-multiply transition-transform group-hover:scale-[1.3]" alt={item.name} />
                      </span>
                      <span className="text-[15px] font-medium text-ink/80 transition-colors group-hover:text-ink">{item.name}</span>
                    </span>
                    <span className="font-mono text-[11px] tracking-tight text-muted/50">Rx</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------- mobile accordion --------------------------- */
function MobileGroup({ title, items, close, viewAllLink, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-4">
      <button aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-[17px] font-medium text-ink">
        {title}
        <ChevronDown size={18} className={`text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-col gap-3.5 pt-4">
              <Link to={viewAllLink} onClick={close} className="flex items-center gap-2 text-[15px] font-medium text-primary">
                View all {title.toLowerCase()} <ArrowRight size={14} />
              </Link>
              {items.map((item, i) => (
                <Link key={i} to={item.link} onClick={close} className="flex items-center gap-3 text-[15px] text-muted transition-colors hover:text-ink">
                  <span className="grid h-8 w-8 place-items-center rounded bg-surface-2">
                    <img src={item.img} alt={item.name} className="h-full w-full scale-[1.1] object-contain mix-blend-multiply" />
                  </span>
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------- navbar ------------------------------- */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Horizontal scroll meter pinned to the bottom of the header.
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const lenis = getLenis();
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    if (lenis) mobileOpen ? lenis.stop() : lenis.start();
    return () => { document.body.style.overflow = "unset"; if (lenis) lenis.start(); };
  }, [mobileOpen]);

  return (
    <>
      {/* promo bar */}
      <div className="bg-panel text-on-panel">
        <div className="mx-auto flex min-h-[40px] max-w-[1240px] items-center justify-center gap-2 px-4 text-center font-mono text-[11px] tracking-[0.07em]">
          <span>New — personalized longevity protocols, formulated by licensed U.S. physicians.</span>
          <Link to="/treatments" className="hidden items-center gap-1 text-accent sm:inline-flex">Start your visit →</Link>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-[68px] max-w-[1340px] items-center justify-between px-5 md:px-10">
          <Link to="/" aria-label="NovaMDK home"><img src="/logo.png" alt="NovaMDK" className="h-[46px] w-auto md:h-[52px]" /></Link>

          <div className="hidden items-center gap-7 lg:flex">
            <NavDropdown title="Treatments" viewAllLink="/treatments" items={treatmentItems} />
            <Link to="/supplements" className="py-2 text-[15px] font-medium text-muted transition-colors hover:text-ink">Supplements</Link>
            <Link to="/kiosk" className="py-2 text-[15px] font-medium text-muted transition-colors hover:text-ink">Kiosk</Link>
            <Link to="/contact" className="py-2 text-[15px] font-medium text-muted transition-colors hover:text-ink">Contact</Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/treatments" className="hidden h-10 items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow lg:flex">
              Get started
            </Link>

            <button aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </nav>

        {/* scroll progress meter */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX }}
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-linear-to-r from-accent to-primary"
        />
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-[100] bg-ink/30 backdrop-blur-sm lg:hidden" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220, ease: EASE }}
              className="fixed right-0 top-0 z-[101] flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-surface lg:hidden nv-scroll"
            >
              <div className="flex items-center justify-between border-b border-line p-4">
                <img src="/logo.png" alt="NovaMDK" className="h-9 w-auto" />
                <button aria-label="Close" onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-muted hover:text-ink">
                  <X size={20} />
                </button>
              </div>
              <div className="flex grow flex-col p-4">
                <MobileGroup title="Treatments" items={treatmentItems} close={() => setMobileOpen(false)} viewAllLink="/treatments" defaultOpen />
                <Link to="/supplements" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-line py-5 text-[17px] font-medium text-ink">
                  Supplements <ArrowRight size={16} className="text-muted" />
                </Link>
                <Link to="/kiosk" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-line py-5 text-[17px] font-medium text-ink">
                  Kiosk <ArrowRight size={16} className="text-muted" />
                </Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-line py-5 text-[17px] font-medium text-ink">
                  Contact <ArrowRight size={16} className="text-muted" />
                </Link>
                <div className="mt-auto flex flex-col gap-2.5 pb-4 pt-8">
                  <Link to="/treatments" onClick={() => setMobileOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[15px] font-semibold text-on-primary">
                    Get started <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
