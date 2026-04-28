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

const SCROLL_THRESHOLD = 200; // never hide above this scrollY (initial view stays interactive)
const HIDE_AFTER_MS = 500;    // continuous down-scroll required to trigger hide

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
          hideTimer = setTimeout(() => {
            setHidden(true);
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
