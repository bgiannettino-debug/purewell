"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

// Wraps the sticky filter bar with scroll-aware show/hide. The lifecycle
// is "show only when likely to be wanted, hide otherwise":
//
// - Above SCROLL_THRESHOLD: bar always visible (initial browse zone).
// - Past threshold, actively scrolling for HIDE_AFTER_MS continuously
//   in either direction: hide. Chrome stays out of the way during fast
//   scroll.
// - Past threshold, scroll just stopped AFTER going UP: bar reveals
//   after IDLE_SHOW_DELAY_MS so the user can grab a filter without
//   scrolling back to the top. Going up signals intent to interact.
// - Past threshold, scroll just stopped AFTER going DOWN: bar stays
//   hidden. The user is reading a product card — leave them alone
//   so they get full viewing area. They have to scroll up to summon
//   the bar.
// - Bar shown on idle pause for AUTO_HIDE_AFTER_IDLE_MS without
//   further scroll: auto-hide. Avoids the bar lingering forever.
// - Any scroll restarts the cycle.
//
// We use transform (not display:none / position changes) so the
// transition is GPU-accelerated and doesn't reflow the page. The
// element keeps its layout space while pinned — translateY(-100%)
// just moves it up by its own height, hiding it behind the already-
// sticky navbar (z:30 > our z:20).

const SCROLL_THRESHOLD = 200;            // never hide above this scrollY
const HIDE_AFTER_MS = 500;               // continuous active scrolling required to hide
const IDLE_SHOW_DELAY_MS = 150;          // how long after scroll stops before bar reveals
const AUTO_HIDE_AFTER_IDLE_MS = 2000;    // bar auto-hides this long after being revealed on idle

type Props = {
  children: ReactNode;
  style?: CSSProperties;
};

export default function ScrollHidingFilterBar({ children, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scrollHideTimer: ReturnType<typeof setTimeout> | null = null;
    let idleShowTimer: ReturnType<typeof setTimeout> | null = null;
    let autoHideTimer: ReturnType<typeof setTimeout> | null = null;
    let isHidden = false;
    let scrolling = false;
    // Track the last scroll direction so the idle-show callback can
    // decide whether to reveal: only on pause-after-up-scroll.
    // pause-after-down-scroll keeps the bar hidden (user is reading).
    let lastY = window.scrollY;
    let lastDirection: "down" | "up" | null = null;

    const setHidden = (h: boolean) => {
      if (isHidden === h) return;
      isHidden = h;
      el.classList.toggle("is-scroll-hidden", h);
    };

    const clear = (t: ReturnType<typeof setTimeout> | null) => {
      if (t) clearTimeout(t);
    };

    const clearAllTimers = () => {
      clear(scrollHideTimer);
      scrollHideTimer = null;
      clear(idleShowTimer);
      idleShowTimer = null;
      clear(autoHideTimer);
      autoHideTimer = null;
    };

    const onScroll = () => {
      const currentY = window.scrollY;

      // Track direction on every event so the idle-show callback can
      // make a directional decision. Only update when there's actual
      // movement; a fired event with delta==0 (rare) keeps the prior
      // direction.
      if (currentY > lastY) lastDirection = "down";
      else if (currentY < lastY) lastDirection = "up";
      lastY = currentY;

      // Above the scroll threshold — always show, reset all state.
      if (currentY <= SCROLL_THRESHOLD) {
        clearAllTimers();
        scrolling = false;
        setHidden(false);
        return;
      }

      // Any scroll cancels a pending auto-hide — user might be reaching
      // for a filter via scroll-to-reveal instead of letting it hide.
      clear(autoHideTimer);
      autoHideTimer = null;

      // First scroll event after a paused period — kick off the
      // scroll-hide timer. If scrolling continues for HIDE_AFTER_MS, hide.
      if (!scrolling) {
        scrolling = true;
        clear(scrollHideTimer);
        scrollHideTimer = setTimeout(() => {
          setHidden(true);
          scrollHideTimer = null;
        }, HIDE_AFTER_MS);
      }

      // Each scroll event resets the idle-show timer; only fires when
      // events stop arriving. That's our scroll-stop detector (no
      // scrollend event with broad enough support yet).
      clear(idleShowTimer);
      idleShowTimer = setTimeout(() => {
        scrolling = false;
        clear(scrollHideTimer);
        scrollHideTimer = null;
        idleShowTimer = null;

        // Direction-aware reveal: only un-hide on pause-after-up-scroll.
        // Pause-after-down-scroll = user is reading a product card, so
        // we leave the bar hidden and give them full viewing area.
        if (lastDirection !== "up") return;

        setHidden(false);

        // Bar is now revealed on idle. Schedule auto-hide so it tucks
        // away if the user doesn't engage within AUTO_HIDE_AFTER_IDLE_MS.
        clear(autoHideTimer);
        autoHideTimer = setTimeout(() => {
          setHidden(true);
          autoHideTimer = null;
        }, AUTO_HIDE_AFTER_IDLE_MS);
      }, IDLE_SHOW_DELAY_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearAllTimers();
    };
  }, []);

  return (
    <div ref={ref} className="sticky-filter-bar scroll-hiding" style={style}>
      {children}
    </div>
  );
}
