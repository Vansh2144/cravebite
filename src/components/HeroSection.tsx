"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, MapPin } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Defer rendering of floating elements to prevent React hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/restaurants");
    }
  };

  // List of emojis/particles to float around
  const particles = [
    { emoji: "🍕", top: "15%", left: "8%", size: "32px", delay: "0s" },
    { emoji: "🍔", top: "25%", right: "12%", size: "40px", delay: "1.5s" },
    { emoji: "🥑", top: "65%", left: "15%", size: "28px", delay: "3s" },
    { emoji: "🍣", top: "70%", right: "10%", size: "36px", delay: "0.5s" },
    { emoji: "🧁", top: "45%", left: "85%", size: "32px", delay: "2.2s" },
    { emoji: "🌶️", top: "12%", right: "30%", size: "24px", delay: "4s" },
  ];

  return (
    <section
      className="relative overflow-hidden flex-center"
      style={{
        minHeight: "550px",
        padding: "var(--space-4xl) 0 var(--space-3xl) 0",
        background: "linear-gradient(180deg, rgba(255, 107, 53, 0.05) 0%, transparent 100%)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Background Glow */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      ></div>

      {/* Floating Particles (Hydration-Safe Client-Side Only) */}
      {isMounted &&
        particles.map((p, idx) => (
          <div
            key={idx}
            className="animate-float hide-mobile"
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              right: p.right,
              fontSize: p.size,
              animationDelay: p.delay,
              zIndex: 1,
              pointerEvents: "none",
              userSelect: "none",
              opacity: 0.75,
            }}
          >
            {p.emoji}
          </div>
        ))}

      <div className="container relative" style={{ zIndex: 10 }}>
        <div className="flex-col text-center" style={{ gap: "var(--space-md)", maxWidth: "800px", margin: "0 auto" }}>
          
          <div style={{ alignSelf: "center" }}>
            <span className="badge badge-primary animate-fade-in-down" style={{ display: "inline-flex", gap: "var(--space-xs)", alignItems: "center" }}>
              <MapPin size={12} />
              <span>Premium Delivery in Your City</span>
            </span>
          </div>

          <h1
            className="animate-fade-in-up"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-6xl)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Cravings <span className="text-gradient">Delivered Fast!</span>
          </h1>

          <p
            className="animate-fade-in-up"
            style={{
              color: "var(--text-secondary)",
              fontSize: "var(--text-xl)",
              maxWidth: "600px",
              margin: "0 auto",
              fontWeight: 400,
            }}
          >
            Discover the best food and drinks from top-rated kitchens in your neighborhood. Freshly prepared, quickly dispatched.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="glass animate-scale-in"
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              margin: "var(--space-md) auto 0 auto",
              padding: "6px 6px 6px 16px",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-medium)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <Search size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search cuisines, dishes, or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              style={{
                background: "transparent",
                border: "none",
                padding: "10px 14px",
                color: "var(--text-primary)",
                fontSize: "var(--text-base)",
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: "var(--radius-lg)" }}>
              <span>Search</span>
            </button>
          </form>

          {/* Actions */}
          <div className="flex-center animate-fade-in-up" style={{ gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
            <button
              onClick={() => router.push("/restaurants")}
              className="btn btn-primary btn-lg"
              style={{ gap: "var(--space-sm)" }}
            >
              <Compass size={18} />
              <span>Explore Restaurants</span>
            </button>
            <button
              onClick={() => router.push("/#cuisines")}
              className="btn btn-secondary btn-lg"
            >
              <span>Popular Cuisines</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
