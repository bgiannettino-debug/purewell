"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

// Wraps the sticky filter bar with scroll-aware show/hide. Direction-
// agnostic: the bar hides whenever the user has been actively
// scrolling (either direction) for more than HIDE_AFTER_MS, and
// reappears IDLE_DELAY_MS after the user stops scrolling. Above
// SCROLL_THRESHOLD the bar is always visible — that's the initial
// browse zone, no point hiding there.
//
// The "active vs. paused" framing matches mobile-app conventions
// (YouTube, Twitter, etc.) — when you're flicking through content,
// chrome gets out of the way; when you stop to read, it reappears
// without you having to swipe in any particular direction.
//
// We use transform (not display:none / position changes) so the
// transition is GPU-accelerated and doesn't reflow the page. The
// element keeps its layout space while pinned — translateY(-100%)
// just moves it up by its own height, hiding it behind the already-
// sticky navbar (z:30 > our z:20).

const SCROLL_THRESHOLD = 200;     // never hide above this scrollY
const HIDE_AFTER_MS = 500;        // continuous active scrolling required to hide
const IDLE_DELAY_MS = 150;        // how long after scroll stops before bar re-appears

type Props = {
  children: ReactNode;
  style?: CSSProperties;
};

export default function ScrollHidingFilterBar({ children, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let isHidden = false;
    let scrolling = false;

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

    const clearIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    const onScroll = () => {
      const currentY = window.scrollY;

      // Above the scroll threshold — always show. Reset state so the
      // next descent below the threshold starts fresh.
      if (currentY <= SCROLL_THRESHOLD) {
        clearHideTimer();
        clearIdleTimer();
        scrolling = false;
        setHidden(false);
        return;
      }

      // First scroll event after a paused period — kick off the hide
      // timer. If the user keeps scrolling for HIDE_AFTER_MS, hide.
      if (!scrolling) {
        scrolling = true;
        clearHideTimer();
        hideTimer = setTimeout(() => {
          setHidden(true);
          hideTimer = null;
        }, HIDE_AFTER_MS);
      }

      // Each scroll event extends the "active" period — the idle
      // timer only fires when scroll events stop arriving for
      // IDLE_DELAY_MS. That's our scroll-stop detector (no native
      // scrollend event with broad enough support yet).
      clearIdleTimer();
      idleTimer = setTimeout(() => {
        scrolling = false;
        clearHideTimer();
        setHidden(false);
        idleTimer = null;
      }, IDLE_DELAY_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearHideTimer();
      clearIdleTimer();
    };
  }, []);

  return (
    <div ref={ref} className="sticky-filter-bar scroll-hiding" style={style}>
      {children}
    </div>
  );
}
