import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantMenuClient from "@/components/RestaurantMenuClient";
import { Star, Clock, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch restaurant
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
  });

  if (!restaurant) {
    notFound();
  }

  // Fetch menu items
  const menuItems = await db.menuItem.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { category: "asc" },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ flexGrow: 1, background: "var(--bg-primary)" }}>
        
        {/* Header Hero Banner */}
        <div
          style={{
            position: "relative",
            minHeight: "260px",
            background: "linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(255, 107, 53, 0.15) 100%)",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "flex-end",
            padding: "var(--space-xl) 0",
          }}
        >
          {/* Back button */}
          <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
            <Link href="/restaurants" className="btn btn-secondary" style={{ gap: "var(--space-xs)" }}>
              <ChevronLeft size={16} />
              <span>Back to Restaurants</span>
            </Link>
          </div>

          <div className="container" style={{ position: "relative", zIndex: 5 }}>
            <div className="flex-col" style={{ gap: "var(--space-sm)" }}>
              
              <span className="badge badge-primary" style={{ width: "fit-content" }}>
                {restaurant.cuisine}
              </span>

              <h1 style={{ fontSize: "var(--text-4xl)", fontFamily: "var(--font-display)", fontWeight: "800", color: "white" }}>
                {restaurant.name}
              </h1>

              <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "var(--text-sm)", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star size={16} fill="currentColor" color="var(--gold)" />
                  <span style={{ color: "var(--text-primary)", fontWeight: "700" }}>{restaurant.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={16} />
                  <span>{restaurant.deliveryTime} mins delivery</span>
                </div>
                <span>•</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={16} />
                  <span>{restaurant.address}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Menu Section */}
        <section className="section" style={{ paddingTop: "var(--space-xl)" }}>
          <div className="container">
            <RestaurantMenuClient
              restaurant={{
                id: restaurant.id,
                name: restaurant.name,
                slug: restaurant.slug,
                address: restaurant.address,
                rating: restaurant.rating,
                cuisine: restaurant.cuisine,
                deliveryTime: restaurant.deliveryTime,
              }}
              menuItems={menuItems.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                isVeg: item.isVeg,
                available: item.available,
              }))}
            />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
