"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Check } from "lucide-react";

interface RestaurantFiltersProps {
  cuisines: string[];
}

export default function RestaurantFilters({ cuisines }: RestaurantFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get("cuisine") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "rating");
  const [vegOnly, setVegOnly] = useState(searchParams.get("veg") === "true");

  // Sync state with URL changes (e.g. from hero search or home page)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSelectedCuisine(searchParams.get("cuisine") || "");
    setSortBy(searchParams.get("sort") || "rating");
    setVegOnly(searchParams.get("veg") === "true");
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (selectedCuisine) params.set("cuisine", selectedCuisine);
    if (sortBy) params.set("sort", sortBy);
    if (vegOnly) params.set("veg", "true");

    router.push(`/restaurants?${params.toString()}`);
  };

  const handleClear = () => {
    setSearch("");
    setSelectedCuisine("");
    setSortBy("rating");
    setVegOnly(false);
    router.push("/restaurants");
  };

  return (
    <div
      className="glass"
      style={{
        padding: "var(--space-lg)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-medium)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
        marginBottom: "var(--space-xl)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)", alignItems: "center" }}>
        
        {/* Search Input */}
        <div className="input-group" style={{ flex: "1 1 300px" }}>
          <label className="input-label" htmlFor="search-control">Search Restaurants</label>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
            <input
              id="search-control"
              type="text"
              className="input w-full"
              style={{ paddingLeft: "40px" }}
              placeholder="Search by restaurant name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
        </div>

        {/* Sort Select */}
        <div className="input-group" style={{ flex: "1 1 180px" }}>
          <label className="input-label" htmlFor="sort-control">Sort By</label>
          <select
            id="sort-control"
            className="input w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23B0B0C8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
          >
            <option value="rating">Top Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

        {/* Veg-Only toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginTop: "24px" }}>
          <button
            onClick={() => setVegOnly(!vegOnly)}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-medium)",
              background: vegOnly ? "var(--accent)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {vegOnly && <Check size={14} color="black" strokeWidth={3} />}
          </button>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: "500" }}>Pure Veg Options Only</span>
        </div>

      </div>

      {/* Cuisine Quick Tags */}
      <div>
        <span className="input-label" style={{ display: "block", marginBottom: "var(--space-sm)" }}>Filter by Cuisine</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(selectedCuisine === cuisine ? "" : cuisine)}
              className="badge"
              style={{
                cursor: "pointer",
                background: selectedCuisine === cuisine ? "var(--primary-glow)" : "var(--bg-glass)",
                color: selectedCuisine === cuisine ? "var(--primary)" : "var(--text-secondary)",
                border: `1px solid ${selectedCuisine === cuisine ? "var(--primary)" : "var(--border-light)"}`,
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-xs)",
                fontWeight: "600",
                transition: "all var(--transition-fast)",
              }}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-md)", marginTop: "var(--space-xs)" }}>
        <button className="btn btn-ghost" onClick={handleClear}>Clear Filters</button>
        <button className="btn btn-primary" onClick={applyFilters} style={{ gap: "var(--space-xs)" }}>
          <SlidersHorizontal size={16} />
          <span>Apply Filters</span>
        </button>
      </div>

    </div>
  );
}
