"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Cuisine {
  name: string;
  image: string;
  query: string;
}

const cuisines: Cuisine[] = [
  { name: "Italian", image: "🍕", query: "Italian" },
  { name: "Indian", image: "🍛", query: "Indian" },
  { name: "Chinese", image: "🥢", query: "Chinese" },
  { name: "Burgers", image: "🍔", query: "Fast Food" },
  { name: "Healthy", image: "🥗", query: "Healthy" },
  { name: "Japanese", image: "🍣", query: "Japanese" },
  { name: "Mexican", image: "🌮", query: "Mexican" },
  { name: "Cafe", image: "☕", query: "Cafe" },
];

export default function CuisineCarousel() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.6;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCuisineClick = (query: string) => {
    router.push(`/restaurants?cuisine=${encodeURIComponent(query)}`);
  };

  return (
    <section id="cuisines" className="section" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-subtle)", position: "relative" }}>
      <div className="container">
        
        <div className="flex-between" style={{ marginBottom: "var(--space-xl)" }}>
          <div>
            <h2 style={{ fontSize: "var(--text-3xl)", fontFamily: "var(--font-display)", fontWeight: "800" }}>
              In the Mood for <span className="text-gradient">Something Specific?</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
              Explore top-rated kitchens by their specialized cuisines
            </p>
          </div>
          
          {/* Controls */}
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <button
              onClick={() => scroll("left")}
              className="btn btn-secondary btn-icon"
              style={{ borderRadius: "var(--radius-full)" }}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="btn btn-secondary btn-icon"
              style={{ borderRadius: "var(--radius-full)" }}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "var(--space-lg)",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE
            paddingBottom: "var(--space-sm)",
          }}
          className="hide-scrollbar"
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {cuisines.map((cuisine, idx) => (
            <button
              key={idx}
              onClick={() => handleCuisineClick(cuisine.query)}
              className="glass"
              style={{
                flex: "0 0 160px",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "var(--space-xl) var(--space-md)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-light)",
                transition: "all var(--transition-bounce)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.transform = "scale(1.05) translateY(-5px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-light)";
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "48px", marginBottom: "var(--space-sm)" }}>
                {cuisine.image}
              </span>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "var(--text-base)",
                  color: "var(--text-primary)",
                }}
              >
                {cuisine.name}
              </span>
            </button>
          ))}
        </div>
        
      </div>
    </section>
  );
}
