/**
 * Cut-out art per treatment goal, shared by the /treatments goal grid and the
 * home hero's rotating spotlight card, so the hero shows the same artwork the
 * grid does from one table rather than two that quietly drift apart.
 *
 * Two sets of geometry, because the surfaces frame the figure differently:
 *
 *   cutout / cutoutClass — the goal grid. A square master anchored to the card's
 *   right edge and sized off the card's HEIGHT. The right-nudges are measured,
 *   not eyeballed: each subject sits at a different left edge inside its square
 *   (weight 28%, recover 0%, longevity 17%, skin 8%, the pill pair 31%), and a
 *   square tall enough to fill the card is wider than the space left of the
 *   copy, so each offset is the shortfall that keeps that subject clear of the
 *   text at the 3-up desktop width.
 *
 *   hero / heroClass — the hero spotlight. Same masters, framed for a short wide
 *   card instead of a square. Each carries a different amount of transparent
 *   padding, so one shared class sized them wildly differently; these numbers
 *   are derived from each file's measured insets rather than picked, so every
 *   subject lands at ~116% of the card height with a small right margin:
 *
 *     file                  subject h   right gap   bottom gap
 *     weightlossnobg.png      100%         0%          0%
 *     sexual-wellness.avif     31%        29%         37%
 *     sportsmedperson.png      99%        38%          0%
 *     longevity.avif          100%         0%          0%
 *     glowing.png              97%         3%          0%
 *
 *   Note the offsets mix axes: a right-% resolves against the card's WIDTH while
 *   the box is sized off its HEIGHT, so each right value is the gap converted
 *   through the card's 2.25:1 aspect. Re-derive if that aspect changes.
 *
 * `bg`/`heroBg` are the client's exact per-card colours — literal hex rather
 * than palette tokens, because the ramp stepping lighter down the grid is the
 * design, not something derivable from --nv-accent. `motion` picks the card's
 * hover layer and `figureMotion` the figure's own polish; both are plain CSS
 * classes, see .nv-goal in index.css.
 */
export const GOAL_ART = {
  "weight-loss": {
    cutout: "/site/goals/weightlossnobg.png",
    cutoutClass: "-top-[2%] h-[104%] right-[-4%]",
    hero: "/site/goals/weightlossnobg.png",
    heroClass: "bottom-0 h-[116%] right-[-6%]",
    bg: "bg-[#a2845d]",
    heroBg: "#a2845d",
    motion: "arrow",
  },
  "mens-health": {
    cutout: "/site/goals/sexual-wellness.avif",
    cutoutClass: "-top-[6%] h-[112%] right-[-7%]",
    hero: "/site/goals/sexual-wellness.avif",
    // The only non-figure in the set, and the most inset master: the pill pair
    // is 31% of its canvas height with a 29% right gap and a 37% bottom gap, so
    // it needs an outsized box pushed down and out to land at ~46% of the card.
    heroClass: "-bottom-[42%] h-[150%] right-[-16%]",
    bg: "bg-[#c1a27a]",
    heroBg: "#c1a27a",
    motion: "glow",
    figureMotion: "float",
  },
  "unisex-sports-medicine": {
    cutout: "/site/goals/sportsmedperson.png",
    cutoutClass: "-top-[1%] h-[102%] left-0",
    hero: "/site/goals/sportsmedperson.png",
    heroClass: "bottom-0 h-[117%] right-[-24%]",
    bg: "bg-[#d1b995]",
    heroBg: "#d1b995",
    motion: "spark",
  },
  "unisex-anti-aging-rx": {
    cutout: "/site/goals/longevity.avif",
    cutoutClass: "-top-[4%] h-[108%] right-[18%]",
    hero: "/site/goals/longevity.avif",
    heroClass: "bottom-0 h-[116%] right-[-2%]",
    bg: "bg-[#d1c0a0]",
    heroBg: "#c9b48f",
    motion: "orbs",
  },
  "unisex-skin-health": {
    cutout: "/site/goals/glowing.png",
    cutoutClass: "-top-[3%] h-[106%] right-[-4%]",
    hero: "/site/goals/glowing.png",
    // Widest of the four portraits, so it runs a little shorter to keep the
    // copy clear at the card's 2.25:1.
    heroClass: "bottom-0 h-[112%] right-[-7%]",
    bg: "bg-[#ddd1b7]",
    heroBg: "#cdbfa1",
    motion: "glow",
    figureMotion: "zoom",
  },
};

export default GOAL_ART;
