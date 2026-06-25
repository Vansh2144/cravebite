import Link from "next/link";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantFilters from "@/components/RestaurantFilters";
import { Star, Clock, Award } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    cuisine?: string;
    sort?: string;
    veg?: string;
  }>;
}

export default async function RestaurantsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const cuisine = resolvedParams.cuisine || "";
  const sort = resolvedParams.sort || "rating";
  const veg = resolvedParams.veg === "true";

  // Build filter conditions
  const whereClause: any = {};

  if (search) {
    whereClause.name = {
      contains: search,
    };
  }

  if (cuisine) {
    whereClause.cuisine = cuisine;
  }

  if (veg) {
    // Check if the restaurant has some veggie options
    whereClause.menuItems = {
      some: {
        isVeg: true,
      },
    };
  }

  // Sorting
  let orderByClause: any = { rating: "desc" };
  if (sort === "deliveryTime") {
    orderByClause = { deliveryTime: "asc" };
  } else if (sort === "name") {
    orderByClause = { name: "asc" };
  }

  const restaurants = await db.restaurant.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });

  // Get all unique cuisines in the database to display filter tags dynamically
  const allRestaurants = await db.restaurant.findMany({
    select: { cuisine: true },
  });
  const uniqueCuisines = Array.from(new Set(allRestaurants.map((r) => r.cuisine)));

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main className="section" style={{ flexGrow: 1, background: "var(--bg-primary)", paddingTop: "var(--space-2xl)" }}>
        <div className="container">
          
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <span className="badge badge-primary" style={{ marginBottom: "var(--space-xs)" }}>
              EXPLORE
            </span>
            <h1 style={{ fontSize: "var(--text-4xl)", fontFamily: "var(--font-display)", fontWeight: "800" }}>
              Explore <span className="text-gradient">Restaurants</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)" }}>
              Find the perfect meal from our handpicked list of local favorites.
            </p>
          </div>

          {/* Filters */}
          <Suspense fallback={<div className="glass" style={{ padding: "var(--space-md)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>Loading filters...</div>}>
            <RestaurantFilters cuisines={uniqueCuisines} />
          </Suspense>

          {/* Listings count */}
          <div style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-md)" }}>
            Showing {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""}
          </div>

          {/* Empty state */}
          {restaurants.length === 0 ? (
            <div
              className="glass"
              style={{
                padding: "var(--space-4xl) var(--space-xl)",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "var(--space-md)" }}>🍽️</div>
              <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "600", marginBottom: "var(--space-xs)" }}>
                No restaurants found
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                Try relaxing your filters or searching for something else!
              </p>
            </div>
          ) : (
            /* Restaurant Cards Grid */
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
                  {/* Image & Overlay */}
                  <div style={{ position: "relative", height: "200px", width: "100%", background: "var(--bg-tertiary)" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(135deg, var(--bg-tertiary), rgba(255, 107, 53, 0.15))`,
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
                        background: "rgba(0,0,0,0.7)",
                        color: "white",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255,255,255,0.2)",
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
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
