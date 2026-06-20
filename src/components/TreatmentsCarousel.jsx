import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldAlert } from "lucide-react";
import { productsData } from "./data/products";

const liquidEase = [0.16, 1, 0.3, 1];

export default function Treatments() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Desktop Drag States
  const [width, setWidth] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [cardWidthWithGap, setCardWidthWithGap] = useState(364);

  const mobileCarouselRef = useRef(null);
  const desktopCarouselRef = useRef(null);

  const featuredIds = [2, 3, 1, 6, 15, 11];
  const products = productsData
    ? featuredIds.map(id => productsData.find(p => p.id === id)).filter(Boolean)
    : [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- DESKTOP: Setup Framer Motion Drag Constraints ---
  useEffect(() => {
    if (isMobile) return;

    const updateCarouselBounds = () => {
      if (desktopCarouselRef.current) {
        const scrollWidth = desktopCarouselRef.current.scrollWidth;
        const offsetWidth = desktopCarouselRef.current.offsetWidth;
        const maxScroll = Math.max(0, scrollWidth - offsetWidth);
        setWidth(maxScroll);

        const cardElement = desktopCarouselRef.current.querySelector('.treatment-card');
        const gap = 24;
        const actualCardWidth = cardElement ? cardElement.offsetWidth + gap : 364;

        setCardWidthWithGap(actualCardWidth);
        const newMaxIndex = Math.ceil(maxScroll / actualCardWidth);
        setMaxIndex(newMaxIndex);
        setActiveIndex(prev => Math.min(prev, newMaxIndex));
      }
    };

    updateCarouselBounds();
    window.addEventListener("resize", updateCarouselBounds);
    setTimeout(updateCarouselBounds, 100);
    return () => window.removeEventListener("resize", updateCarouselBounds);
  }, [products.length, isMobile]);

  // --- MOBILE: Track Native Scrolling ---
  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current || !isMobile) return;

    const scrollLeft = mobileCarouselRef.current.scrollLeft;
    const cardElement = mobileCarouselRef.current.querySelector('.treatment-card');

    if (cardElement) {
      const gap = 16;
      const cardWidth = cardElement.offsetWidth + gap;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    if (isPaused || products.length === 0) return;

    const interval = setInterval(() => {
      if (isMobile) {
        if (!mobileCarouselRef.current) return;

        setActiveIndex((prev) => {
          const nextIndex = prev >= products.length - 1 ? 0 : prev + 1;
          const container = mobileCarouselRef.current;
          const cards = container.querySelectorAll('.treatment-card');
          if (cards[nextIndex]) {
            const card = cards[nextIndex];
            const targetScrollLeft = card.offsetLeft - (container.offsetWidth / 2) + (card.offsetWidth / 2);
            container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
          }
          return nextIndex;
        });

      } else {
        setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, products.length, isMobile, maxIndex]);

  // --- CONTROLS ---
  const scrollToCard = (index) => {
    setActiveIndex(index);
    if (isMobile && mobileCarouselRef.current) {
      const container = mobileCarouselRef.current;
      const cards = container.querySelectorAll('.treatment-card');
      if (cards[index]) {
        const card = cards[index];
        const targetScrollLeft = card.offsetLeft - (container.offsetWidth / 2) + (card.offsetWidth / 2);
        container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
      }
    }
  };

  const handleNext = () => {
    if (!isMobile) setActiveIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (!isMobile) setActiveIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  if (products.length === 0) return null;

  const renderCards = () => products.map((p, i) => (
    <div
      key={i}
      className={`treatment-card group relative flex shrink-0 flex-col rounded-[calc(32px*var(--nv-r-scale,1))] border border-line bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:nv-shadow-lg md:rounded-[calc(40px*var(--nv-r-scale,1))] md:p-8 ${
        isMobile ? 'w-[82vw] max-w-[300px] snap-center sm:max-w-[320px]' : 'w-[340px]'
      }`}
    >
      <h3 className="mb-1 text-[20px] font-medium text-ink md:text-[22px]">{p.name}</h3>
      <p className="mb-6 text-[13px] font-medium text-muted md:text-sm">{p.price}</p>

      <div className="pointer-events-none mb-8 flex h-40 items-center justify-center px-4 md:h-48">
        <img
          src={p.img}
          alt={p.name}
          className="h-full w-full object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:rotate-2 group-hover:scale-105"
        />
      </div>

      <div className="z-10 mb-5 mt-auto flex">
        <Link
          to="/contact"
          className="group/btn flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-primary py-3 text-[13px] font-medium text-on-primary transition-all hover:bg-primary-deep nv-shadow md:gap-2 md:py-3.5 md:text-[14px]"
        >
          Start your visit
          <span className="flex items-center justify-center rounded-full bg-white/20 p-1 transition-colors group-hover/btn:bg-white/30">
            <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <button className="z-10 flex w-full cursor-pointer items-center justify-center gap-1.5 py-1.5 text-center text-[11px] font-medium text-muted transition-colors hover:text-ink md:text-[12px]">
        <ShieldAlert size={14} className="text-primary/70" /> Important safety info
      </button>
    </div>
  ));

  const totalDots = isMobile ? products.length : maxIndex + 1;

  return (
    <section id="treatments-section" className="relative w-full overflow-hidden bg-surface-2 py-[clamp(2rem,4vw,3.5rem)]">
      <div className="mx-auto max-w-[1400px] px-0 md:px-16">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: liquidEase }}
          className="mx-auto mb-[clamp(1.5rem,3vw,2.5rem)] max-w-3xl px-6 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-accent/60" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-primary lg:text-[11px]">Treatments &amp; Solutions</span>
            <span className="h-px w-8 bg-accent/60" />
          </div>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-[52px]">
            Don't just live longer, <br /> <span className="nv-em text-primary">live healthier</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, delay: 0.1, ease: liquidEase }}
          className="relative mx-auto w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {isMobile ? (
            <div
              ref={mobileCarouselRef}
              onScroll={handleMobileScroll}
              className="no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 py-4 pb-6"
            >
              {renderCards()}
              <div className="w-[4vw] shrink-0" />
            </div>
          ) : (
            <div className="w-full overflow-hidden py-4" ref={desktopCarouselRef}>
              <motion.div
                className="flex w-max cursor-grab gap-6 px-2 pb-6 pt-2 active:cursor-grabbing"
                drag="x"
                dragConstraints={{ right: 0, left: -width }}
                initial={{ x: 0 }}
                animate={{ x: width > 0 ? -Math.min(activeIndex * cardWidthWithGap, width) : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              >
                {renderCards()}
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {!isMobile && activeIndex > 0 && (
              <motion.button
                aria-label="Previous treatment"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={handlePrev}
                className="absolute -left-6 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink transition-all hover:text-primary hover:nv-shadow-lg nv-shadow md:flex"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isMobile && activeIndex < maxIndex && (
              <motion.button
                aria-label="Next treatment"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={handleNext}
                className="absolute -right-6 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink transition-all hover:text-primary hover:nv-shadow-lg nv-shadow md:flex"
              >
                <ChevronRight size={24} strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.5, ease: liquidEase }}
          className="mt-2 flex items-center justify-center gap-2 md:mt-4"
        >
          {Array.from({ length: totalDots }).map((_, idx) => (
            <div
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-line-strong hover:bg-muted/40'}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
