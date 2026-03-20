"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const featuredScreens = [
  {
    id: 1,
    category: "Feed & Community",
    title: "Explore real founder journeys.",
    subtitle: "",
    image: "/feed.png",
    bgColor: "bg-black",
    textColor: "text-white",
  },
  {
    id: 2,
    category: "Environment",
    title: "A vibrant startup ecosystem.",
    subtitle: "",
    image: "/environment.png",
    bgColor: "bg-emerald-800",
    textColor: "text-white",
  },
  {
    id: 3,
    category: "Hub",
    title: "Events, gigs, and competitions.",
    subtitle: "",
    image: "/hub-section.png",
    bgColor: "bg-blue-900",
    textColor: "text-white",
  },
  {
    id: 4,
    category: "Startup Profile",
    title: "Your startup, discoverable & trackable.",
    subtitle: "",
    image: "/startup-profile.png",
    bgColor: "bg-purple-900",
    textColor: "text-white",
  },
  {
    id: 5,
    category: "Profile",
    title: "Personalized founder identity.",
    subtitle: "",
    image: "/profile.png",
    bgColor: "bg-green-900",
    textColor: "text-white",
  },
  {
    id: 6,
    category: "Portfolio",
    title: "Showcase your work & skills.",
    subtitle: "",
    image: "/portfolio.png",
    bgColor: "bg-slate-800",
    textColor: "text-white",
  },
];

// Triple the screens for a seamless infinite loop:
//  [copy-1] | [copy-2 ← we always live here] | [copy-3]
// When the user drifts into copy-1 or copy-3 we silently
// teleport to the matching position inside copy-2.
const loopedScreens = [
  ...featuredScreens,
  ...featuredScreens,
  ...featuredScreens,
];
const ORIG = featuredScreens.length; // 6
const TOTAL = loopedScreens.length;  // 18

export default function HorizontalCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ on: false, startX: 0, startLeft: 0 });

  /* ── Init: snap to the start of copy-2 ──────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // rAF ensures the flex layout has resolved scrollWidth
    requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth / 3;
    });
  }, []);

  /* ── Infinite-loop scroll handler ────────────────────────────── */
  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const W = el.scrollWidth / 3; // width of one full copy
    let sl = el.scrollLeft;

    // Teleport: drifted into copy-1 → jump to copy-2
    if (sl < W) {
      el.scrollLeft = sl + W;
      sl += W;
    // Teleport: drifted into copy-3 → jump to copy-2
    } else if (sl >= W * 2) {
      el.scrollLeft = sl - W;
      sl -= W;
    }

    // Active dot: which card inside the original set are we nearest?
    const cardW = el.scrollWidth / TOTAL;
    const offset = ((sl - W) % W + W) % W;
    const idx = Math.round(offset / cardW) % ORIG;
    setActiveIdx(Math.min(Math.max(idx, 0), ORIG - 1));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  /* ── Auto-scroll (pause on hover / drag) ─────────────────────── */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const el = containerRef.current;
      if (el) el.scrollBy({ left: el.scrollWidth / TOTAL, behavior: "smooth" });
    }, 3500);
    return () => clearInterval(id);
  }, [paused]);

  /* ── Step helper (arrows + keyboard) ────────────────────────── */
  const step = useCallback((dir: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.scrollWidth / TOTAL), behavior: "smooth" });
  }, []);

  /* ── Keyboard nav ────────────────────────────────────────────── */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [step]);

  /* ── Mouse drag-to-scroll ────────────────────────────────────── */
  const onMouseDown = (e: React.MouseEvent) => {
    drag.current = {
      on: true,
      startX: e.clientX,
      startLeft: containerRef.current?.scrollLeft ?? 0,
    };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.on || !containerRef.current) return;
    containerRef.current.scrollLeft =
      drag.current.startLeft - (e.clientX - drag.current.startX);
  };
  const stopDrag = () => { drag.current.on = false; };

  /* ── Dot click: navigate to specific card ───────────────────── */
  const goTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const W = el.scrollWidth / 3;
    const cardW = el.scrollWidth / TOTAL;
    el.scrollLeft = W + i * cardW;
    setActiveIdx(i);
  };

  return (
    <div
      className={`${poppins.variable} font-sans`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); stopDrag(); }}
    >
      <div className="w-full bg-gray-50 py-10 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="mb-7 sm:mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-3">
              Featured <span className="text-gray-400">Screens</span>
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-gray-600 font-medium">
              Get to know the app.
            </p>
          </div>

          {/* Carousel track + arrow buttons */}
          <div className="relative">
            <div
              ref={containerRef}
              className="flex gap-3 sm:gap-5 md:gap-6 overflow-x-auto pb-3 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
            >
              {loopedScreens.map((screen, i) => (
                <div
                  key={`${screen.id}-${i}`}
                  className={[
                    "flex-shrink-0",
                    // Mobile-first widths
                    "w-[215px] sm:w-72 md:w-80 lg:w-96",
                    // Mobile-first heights (phone-screen proportions)
                    "h-[460px] sm:h-[560px] md:h-[640px] lg:h-[720px]",
                    screen.bgColor,
                    "rounded-2xl sm:rounded-3xl overflow-hidden",
                  ].join(" ")}
                >
                  <div className="p-3.5 sm:p-5 h-full flex flex-col">
                    {/* Copy */}
                    <div>
                      <p className={`text-[11px] sm:text-sm ${screen.textColor} opacity-70 mb-0.5 sm:mb-2`}>
                        {screen.category}
                      </p>
                      <h3 className={`text-[14px] sm:text-xl md:text-2xl font-bold ${screen.textColor} leading-tight`}>
                        {screen.title}
                        {screen.subtitle && (
                          <sup className="text-sm">{screen.subtitle}</sup>
                        )}
                      </h3>
                    </div>

                    {/* Screenshot image */}
                    <div className="relative w-full flex-1 mt-2 sm:mt-3 rounded-xl overflow-hidden">
                      <img
                        src={screen.image}
                        alt={screen.title}
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>

                    {/* Plus icon – visible on sm+ */}
                    <div className="hidden sm:flex justify-end mt-3">
                      <Plus className={`w-7 h-7 ${screen.textColor} opacity-50`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prev / Next arrows (hidden on mobile) */}
            <button
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:bg-white transition-colors z-10"
              onClick={() => step(-1)}
              aria-label="Previous screen"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:bg-white transition-colors z-10"
              onClick={() => step(1)}
              aria-label="Next screen"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-1.5 mt-5 sm:mt-6">
            {featuredScreens.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIdx
                    ? "w-5 sm:w-6 h-2 bg-black"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to screen ${i + 1}`}
              />
            ))}
          </div>

          <p className="mt-3 text-center text-gray-400 text-xs sm:text-sm">
            Swipe or use ← → keys to explore
          </p>
        </div>
      </div>
    </div>
  );
}
