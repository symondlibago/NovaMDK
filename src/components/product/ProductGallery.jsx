import React, { useEffect, useState } from "react";

/* Product image gallery with thumbnails.

   Most products carry two real assets: `img` (a transparent cut-out render) and
   `imgDetail` (a photo with its own backdrop). Those two need opposite treatment
   in the frame — a cut-out gets centred and multiplied onto white with a pedestal
   shadow, a photo fills edge to edge — so each frame tracks its own kind rather
   than the product's. The remaining frames are shared category-level shots from
   /products/gallery. */

/**
 * Frames for a product: its own photography only.
 *
 * Category lifestyle shots are deliberately NOT here. They illustrate the
 * editorial sections further down the page, but in the hero gallery they read as
 * "here is another view of the product", which they are not — a thumbnail strip
 * of stock imagery next to a vial is confusing and looks padded.
 */
function framesFor(product) {
  const frames = [];
  if (product.imgDetail) frames.push({ src: product.imgDetail, photo: true });
  // Guard against a product pointing both fields at the same file.
  if (product.img && product.img !== product.imgDetail) {
    frames.push({ src: product.img, photo: false });
  }
  return frames;
}

export default function ProductGallery({ product, categoryLabel }) {
  const frames = framesFor(product);
  const [i, setI] = useState(0);

  // Switching dose rungs swaps the product under us; reset to its first frame
  // rather than leaving the viewer on a stale index.
  useEffect(() => { setI(0); }, [product.id]);

  const active = frames[Math.min(i, frames.length - 1)] || { src: product.img, photo: false };

  return (
    <div className="min-w-0">
      <div
        className={`group/img relative flex min-h-90 items-center justify-center overflow-hidden rounded-[calc(30px*var(--nv-r-scale,1))] border border-line nv-shadow md:min-h-140 ${
          active.photo ? "" : "bg-white p-7 md:p-10"
        }`}
      >
        {/* pedestal shadow — only grounds a cut-out; a photo has its own */}
        {!active.photo && (
          <div className="pointer-events-none absolute bottom-[16%] left-1/2 h-6 w-2/5 -translate-x-1/2 rounded-[50%] bg-ink/15 blur-xl" />
        )}

        <span className="absolute left-6 top-6 z-10 rounded-full border border-line bg-surface/90 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent backdrop-blur-sm">
          {categoryLabel}
        </span>
        {product.dosageForm && (
          <span className="absolute bottom-6 left-6 z-10 rounded-full bg-ink px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-on-panel">
            {product.dosageForm}
          </span>
        )}

        <img
          key={active.src}
          src={active.src}
          alt={product.name}
          className={
            active.photo
              ? "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.03]"
              : "relative max-h-100 w-auto max-w-full object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-500 group-hover/img:scale-[1.03] md:max-h-115"
          }
        />
      </div>

      {frames.length > 1 && (
        <div className="mt-3 flex gap-2.5" role="tablist" aria-label="Product images">
          {frames.map((f, idx) => (
            <button
              key={f.src}
              role="tab"
              type="button"
              aria-selected={idx === i}
              aria-label={`View image ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-[calc(14px*var(--nv-r-scale,1))] border transition-all ${
                idx === i
                  ? "border-primary nv-shadow"
                  : "border-line opacity-70 hover:opacity-100 hover:border-line-strong"
              } ${f.photo ? "" : "bg-white p-1.5"}`}
            >
              <img
                src={f.src}
                alt=""
                loading="lazy"
                className={f.photo ? "h-full w-full object-cover" : "h-full w-full object-contain mix-blend-multiply"}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
