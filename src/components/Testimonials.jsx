import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

const liquidEase = [0.16, 1, 0.3, 1];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Desktop Drag States
  const [width, setWidth] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [cardWidthWithGap, setCardWidthWithGap] = useState(364);

  const mobileCarouselRef = useRef(null);
  const desktopCarouselRef = useRef(null);

  const reviews = [
    { name: "Theresa", text: "NAD+ really helped me feel more energetic and has improved my health. I feel great! The continuous care is unmatched." },
    { name: "Anna", text: "My experience with NovaMD was simple and straightforward. I would have had to jump through so many hoops to get this same experience elsewhere." },
    { name: "Melisa", text: "I have lost 46lbs in 8 weeks. It is extremely convenient to order online and have consultations with top-tier professionals if needed." },
    { name: "Joshua", text: "I have been with this company for over a year and their customer service is above and beyond. I appreciate the sincere and kind representatives." },
    { name: "Sarah", text: "The continuous support from the medical team gave me the confidence I needed. The whole process is incredibly smooth and professional." }
  ];

  // Track Window Resize to switch between Mobile (Native) and Desktop (Framer Drag)
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

        const cardElement = desktopCarouselRef.current.querySelector('.review-card');
        const gap = 24;
        const actualCardWidth = cardElement ? cardElement.offsetWidth + gap : 364;

        setCardWidthWithGap(actualCardWidth);
        const newMaxIndex = Math.ceil(maxScroll / actualCardWidth);
        setMaxIndex(newMaxIndex);
        setActiveIndex(prev => Math.min(prev, newMaxIndex));
      }
    };

    setTimeout(updateCarouselBounds, 50);
    window.addEventListener("resize", updateCarouselBounds);
    return () => window.removeEventListener("resize", updateCarouselBounds);
  }, [reviews.length, isMobile]);

  // --- MOBILE: Track Native Scrolling ---
  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current || !isMobile) return;

    const scrollLeft = mobileCarouselRef.current.scrollLeft;
    const cardElement = mobileCarouselRef.current.querySelector('.review-card');

    if (cardElement) {
      const gap = 16;
      const cardWidth = cardElement.offsetWidth + gap;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  // --- CONTROLS ---
  const scrollToCard = (index) => {
    setActiveIndex(index);
    if (isMobile && mobileCarouselRef.current) {
      const container = mobileCarouselRef.current;
      const cards = container.querySelectorAll('.review-card');

      if (cards[index]) {
        const card = cards[index];
        const targetScrollLeft = card.offsetLeft - (container.offsetWidth / 2) + (card.offsetWidth / 2);
        container.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
      }
    }
  };

  const handleNext = () => {
    if (!isMobile && activeIndex < maxIndex) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isMobile && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  // Reusable card template
  const renderCards = () => reviews.map((review, i) => (
      <div
        key={i}
        className={`review-card group shrink-0 flex flex-col h-full min-h-90 rounded-[24px] border border-line bg-surface p-8 md:p-10 nv-shadow transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:nv-shadow-lg ${
          isMobile ? 'snap-center w-[82vw] max-w-[300px] sm:max-w-[320px]' : 'w-[340px]'
        }`}
      >
          {/* Rating stars */}
          <div className="mb-6 flex justify-center gap-1 text-primary">
            {[1,2,3,4,5].map(star => (
               <svg key={star} width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>

          {/* Editorial quote text */}
          <p className="mb-8 grow text-center font-display text-[1rem] italic leading-relaxed text-ink/80 md:text-[1.06rem]">
              "{review.text}"
          </p>

          <div className="mt-auto text-center">
              <p className="mb-3 text-[0.95rem] font-semibold text-ink">{review.name}</p>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">
                  <ShieldCheck size={14} className="text-primary" /> Verified
              </div>
          </div>
      </div>
  ));

  const totalDots = isMobile ? reviews.length : maxIndex + 1;

  return (
    <section className="w-full overflow-hidden bg-bg py-[clamp(4rem,8vw,7rem)]">
      <div className="mx-auto max-w-[1240px] px-0 text-center md:px-16">

        {/* --- ANIMATED HEADER --- */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, ease: liquidEase }}
            className="flex flex-col items-center px-6"
        >
            <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-accent/60" />
                <span className="nv-eyebrow">Testimonials</span>
                <span className="h-px w-8 bg-accent/60" />
            </div>

            <h2 className="mb-4 text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold leading-tight tracking-tight text-ink">
                200,000+ members <span className="nv-em text-primary">thriving</span>
            </h2>

            <div className="mb-16 flex items-center justify-center gap-3 text-[0.92rem] font-medium text-muted">
                <span>Excellent 4.9/5</span>
                <div className="flex gap-0.5 text-primary">
                {[1,2,3,4,5].map(star => (
                    <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
                </div>
                <span>4,000+ reviews</span>
            </div>
        </motion.div>

        {/* --- ANIMATED HYBRID CAROUSEL --- */}
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, delay: 0.1, ease: liquidEase }}
            className="relative mx-auto max-w-6xl"
        >
          {isMobile ? (
            // MOBILE: Native CSS Scroll Snap
            <div
              ref={mobileCarouselRef}
              onScroll={handleMobileScroll}
              className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 py-8 pb-12 no-scrollbar"
            >
              {renderCards()}
              <div className="w-[4vw] shrink-0"></div>
            </div>
          ) : (
            // DESKTOP: Framer Motion Spring Drag
            <div className="w-full overflow-hidden py-8" ref={desktopCarouselRef}>
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

          {/* Desktop Navigation Arrows */}
          <AnimatePresence>
            {!isMobile && activeIndex > 0 && (
              <motion.button
                aria-label="Previous testimonial"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={handlePrev}
                className="absolute -left-6 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-ink nv-shadow transition-all hover:border-primary hover:text-primary hover:nv-shadow-lg md:flex cursor-pointer"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isMobile && activeIndex < maxIndex && (
              <motion.button
                aria-label="Next testimonial"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={handleNext}
                className="absolute -right-6 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-ink nv-shadow transition-all hover:border-primary hover:text-primary hover:nv-shadow-lg md:flex cursor-pointer"
              >
                <ChevronRight size={24} strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic Pagination Dots */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, delay: 0.4, ease: liquidEase }}
            className="mt-2 flex items-center justify-center gap-2 md:mt-4"
        >
          {Array.from({ length: totalDots }).map((_, idx) => (
            <div
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-line-strong hover:bg-muted/50'}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
