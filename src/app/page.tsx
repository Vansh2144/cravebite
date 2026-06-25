import Link from "next/link";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CuisineCarousel from "@/components/CuisineCarousel";
import Footer from "@/components/Footer";
import { Star, Clock, ArrowRight, Award } from "lucide-react";

export const revalidate = 60; // Revalidate cache every 60s

export default async function Home() {
  const restaurants = await db.restaurant.findMany({
    take: 6,
    orderBy: { rating: "desc" },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <CuisineCarousel />

      {/* Popular Restaurants Section */}
      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: "var(--space-xl)" }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "var(--space-xs)" }}>
                CRITICS CHOICE
              </span>
              <h2 style={{ fontSize: "var(--text-3xl)", fontFamily: "var(--font-display)", fontWeight: "800" }}>
                Popular Restaurants <span className="text-gradient">Near You</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                Curated collections of the best dining places in town based on user reviews
              </p>
            </div>
            
            <Link href="/restaurants" className="btn btn-outline" style={{ gap: "var(--space-sm)" }}>
              <span>View All Restaurants</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid-responsive grid-3 stagger-children">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.slug}`}
                className="glass-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                {/* Image & Badges overlay */}
                <div style={{ position: "relative", height: "200px", width: "100%", background: "var(--bg-tertiary)" }}>
                  {/* Since we don't have real files for restaurant images, we use a nice placeholder background gradient based on cuisine or name */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(135deg, var(--bg-tertiary), rgba(255, 107, 53, 0.2))`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "64px",
                    }}
                  >
                    {restaurant.cuisine === "Italian" && "🍕"}
                    {restaurant.cuisine === "Indian" && "🍛"}
                    {restaurant.cuisine === "Chinese" && "🥢"}
                    {restaurant.cuisine === "Fast Food" && "🍔"}
                    {restaurant.cuisine === "Healthy" && "🥗"}
                    {restaurant.cuisine === "Japanese" && "🍣"}
                    {restaurant.cuisine === "Mexican" && "🌮"}
                    {restaurant.cuisine === "Cafe" && "☕"}
                  </div>

                  {restaurant.isPremium && (
                    <span
                      className="badge badge-warning"
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <Award size={12} />
                      <span>PREMIUM</span>
                    </span>
                  )}

                  <span
                    className="badge"
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {restaurant.cuisine}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", flexGrow: 1, gap: "var(--space-sm)" }}>
                  <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "700" }}>{restaurant.name}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", flexGrow: 1 }}>{restaurant.address}</p>
                  
                  <div className="divider" style={{ margin: "var(--space-sm) 0" }}></div>

                  <div className="flex-between">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="star-rating">
                        <Star size={16} fill="currentColor" />
                      </span>
                      <span style={{ fontWeight: "700", fontSize: "var(--text-sm)" }}>{restaurant.rating.toFixed(1)}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                      <Clock size={14} />
                      <span>{restaurant.deliveryTime} mins</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
