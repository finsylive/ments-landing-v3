"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Poppins } from "next/font/google";

/**
 * HorizontalCarousel component – v2
 * Enlarged cards (≈1.5×) for more immersive app-screen previews.
 * - Card widths: 384 / 432 / 480 px (w-96 / custom) depending on breakpoint
 * - Card height: 750 px
 * - Scroll step bumped to 520 px to match new width + gap
 */

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
    image: "/feed.png",           // Feed screenshot
    bgColor: "bg-black",
    textColor: "text-white",
  },
  {
    id: 2,
    category: "Environment",
    title: "A vibrant startup ecosystem.",
    subtitle: "",
    image: "/environment.png",    // Environment screenshot
    bgColor: "bg-emerald-800",
    textColor: "text-white",
  },
  {
    id: 3,
    category: "Hub",
    title: "Events, gigs, and competitions.",
    subtitle: "",
    image: "/hub-section.png",    // Hub screenshot
    bgColor: "bg-blue-900",
    textColor: "text-white",
  },
  {
    id: 4,
    category: "Startup Profile",
    title: "Your startup, discoverable & trackable.",
    subtitle: "",
    image: "/startup-profile.png", // Startup Profile screenshot
    bgColor: "bg-purple-900",
    textColor: "text-white",
  },
  {
    id: 5,
    category: "Profile",
    title: "Personalized founder identity.",
    subtitle: "",
    image: "/profile.png",        // Personal profile screenshot
    bgColor: "bg-green-900",
    textColor: "text-white",
  },
  {
    id: 6,
    category: "Portfolio",
    title: "Showcase your work & skills.",
    subtitle: "",
    image: "/portfolio.png",      // Portfolio screenshot
    bgColor: "bg-slate-800",
    textColor: "text-white",
  },
];


export default function HorizontalCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -410, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 410, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", checkScrollButtons);
    checkScrollButtons();
    return () => container?.removeEventListener("scroll", checkScrollButtons);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollRight();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`${poppins.variable} font-sans`}>
      <div className="w-full bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-poppins font-bold mb-4">
              Featured <span className="text-gray-400">Screens</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-poppins font-medium">
              Get to know the app.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {featuredScreens.map((screen) => (
                <Card
                  key={screen.id}
                  className={`flex-shrink-0 w-96 sm:w-[432px] md:w-[480px] h-[750px] ${screen.bgColor} border-0 rounded-3xl overflow-hidden relative group`}
                >
                  <CardContent className="p-4 h-full flex flex-col">
                    {/* Copy */}
                    <div>
                      <p className={`text-sm ${screen.textColor} opacity-80 mb-2 font-poppins`}>{screen.category}</p>
                      <h3 className={`text-2xl font-bold ${screen.textColor} leading-tight`}>
                        {screen.title}
                        {screen.subtitle && <sup className="text-sm">{screen.subtitle}</sup>}
                      </h3>
                    </div>

                    {/* Image */}
                    <div className="relative w-full flex-1 mt-2 rounded-xl overflow-hidden ">
                      <img
                        src={screen.image}
                        alt={screen.title}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>

                    {/* Plus icon */}
                    <div className="flex justify-end mt-4">
                      <Plus className={`w-8 h-8 ${screen.textColor} opacity-60 group-hover:opacity-100`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Nav arrows */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
                onClick={scrollRight}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-500 text-sm font-poppins">
            Scroll horizontally or use → / ← keys
          </p>
        </div>
      </div>
    </div>
  );
}