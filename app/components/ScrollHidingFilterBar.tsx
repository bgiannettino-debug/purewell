"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

// Wraps the sticky filter bar with scroll-aware show/hide. After the
// user has been scrolling DOWN continuously for HIDE_AFTER_MS past
// the SCROLL_THRESHOLD, the bar slides up under the navbar via a
// transform — giving them the full viewport height for browsing
// products. Any upward scroll cancels the pending hide and slides
// the bar back into view immediately, so it's always one flick away.
//
// We use a transform (not display:none / position changes) so the
// transition is GPU-friendly and doesn't reflow surrounding content.
// The element keeps its layout space while pinned — translateY(-100%)
// just moves it up by its own height, which puts it behind the
// already-sticky navbar (z:30 > our z:20).

// Tunable timing/distance thresholds. The previous values felt "touchy"
// because the timer fired whether or not the user was still scrolling —
// so a brief down-then-pause-to-read would still hide the bar after
// 500ms. Combined with a low scroll threshold, even small scroll
// movements would dismiss the filter row.
//
// The new model is: hide only if the user has been scrolling DOWN
// continuously for HIDE_AFTER_MS AND was still actively scrolling
// within ACTIVE_SCROLL_GRACE_MS of the timer firing. Paused readers
// keep their filter bar visible.
const SCROLL_THRESHOLD = 240;        // never hide above this scrollY
const HIDE_AFTER_MS = 1000;          // continuous downward scrolling required (was 500)
const ACTIVE_SCROLL_GRACE_MS = 250;  // must have scrolled within this window of timer fire

type Props = {
  children: ReactNode;
  style?: CSSProperties;
};

export default function ScrollHidingFilterBar({ children, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastY = window.scrollY;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let isHidden = false;
    let direction: "down" | "up" | null = null;
    // Timestamp of the most recent scroll event. Used at timer fire
    // to verify the user is still actively scrolling (vs. paused to
    // read), which is the missing condition that made the previous
    // implementation feel touchy.
    let lastScrollAt = Date.now();

    const setHidden = (h: boolean) => {
      if (isHidden === h) return;
      isHidden = h;
      el.classList.toggle("is-scroll-hidden", h);
    };

    const clearHideTimer = () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const onScroll = () => {
      lastScrollAt = Date.now();
      const currentY = window.scrollY;
      const newDirection: "down" | "up" | null =
        currentY > lastY ? "down" : currentY < lastY ? "up" : null;

      // Near the top of the page — always show. Prevents hide-state
      // from sticking around if the user scrolls back to the hero
      // and then immediately starts scrolling down again.
      if (currentY <= SCROLL_THRESHOLD) {
        clearHideTimer();
        setHidden(false);
        lastY = currentY;
        direction = newDirection;
        return;
      }

      // Direction change kicks off (or cancels) the hide schedule.
      if (newDirection && newDirection !== direction) {
        direction = newDirection;
        clearHideTimer();

        if (newDirection === "up") {
          // Any upward movement reveals immediately.
          setHidden(false);
        } else if (newDirection === "down") {
          // Schedule hide. If user pivots up before the timer fires,
          // the next direction change cancels it via clearHideTimer.
          // At fire time we also check the user is STILL actively
          // scrolling (last scroll event within ACTIVE_SCROLL_GRACE_MS)
          // — if they paused to read, the bar stays visible.
          hideTimer = setTimeout(() => {
            const stillActive = Date.now() - lastScrollAt < ACTIVE_SCROLL_GRACE_MS;
            if (stillActive) setHidden(true);
            hideTimer = null;
          }, HIDE_AFTER_MS);
        }
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearHideTimer();
    };
  }, []);

  return (
    <div ref={ref} className="sticky-filter-bar scroll-hiding" style={style}>
      {children}
    </div>
  );
}
