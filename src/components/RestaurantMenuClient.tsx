"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Star, Clock, ShoppingBag, Plus, Check } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  isVeg: boolean;
  available: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating: number;
  cuisine: string;
  deliveryTime: number;
}

interface RestaurantMenuProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
}

export default function RestaurantMenuClient({ restaurant, menuItems }: RestaurantMenuProps) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Get list of categories dynamically
  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

  // Filter items based on category selection
  const filteredItems = activeCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  // Helper to find if an item is already in the cart and return its quantity
  const getCartQuantity = (itemId: string) => {
    const cartItem = cartItems.find((item) => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="grid-responsive" style={{ gridTemplateColumns: "250px 1fr", gap: "var(--space-xl)", alignItems: "start" }}>
      
      {/* Category Sidebar Navigation (sticky) */}
      <div
        className="glass hide-mobile"
        style={{
          position: "sticky",
          top: "90px",
          padding: "var(--space-md)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-medium)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-xs)",
        }}
      >
        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: "700", padding: "0 var(--space-sm) var(--space-sm) var(--space-sm)", borderBottom: "1px solid var(--border-subtle)", marginBottom: "var(--space-xs)" }}>
          Categories
        </h4>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className="btn btn-ghost"
            style={{
              justifyContent: "flex-start",
              background: activeCategory === category ? "var(--bg-glass-strong)" : "transparent",
              color: activeCategory === category ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: activeCategory === category ? "700" : "500",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-sm) var(--space-md)",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Main Menu List */}
      <div className="flex-col" style={{ gap: "var(--space-xl)" }}>
        
        {/* Mobile Horizontal Category Scroller */}
        <div
          className="hide-desktop"
          style={{
            display: "flex",
            gap: "var(--space-sm)",
            overflowX: "auto",
            paddingBottom: "var(--space-sm)",
            marginBottom: "var(--space-sm)",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="badge"
              style={{
                cursor: "pointer",
                background: activeCategory === category ? "var(--primary-glow)" : "var(--bg-glass)",
                color: activeCategory === category ? "var(--primary)" : "var(--text-secondary)",
                border: `1px solid ${activeCategory === category ? "var(--primary)" : "var(--border-light)"}`,
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-xs)",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          {filteredItems.map((item) => {
            const quantity = getCartQuantity(item.id);
            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  display: "flex",
                  gap: "var(--space-md)",
                  padding: "var(--space-lg)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  alignItems: "center",
                }}
              >
                {/* Veg / Non-Veg Indicator Dot */}
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: `1.5px solid ${item.isVeg ? "#4ADE80" : "#F87171"}`,
                      padding: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "2px",
                    }}
                    title={item.isVeg ? "Veg" : "Non-Veg"}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: item.isVeg ? "#4ADE80" : "#F87171",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Details */}
                <div style={{ flexGrow: 1 }} className="flex-col">
                  <span className="badge badge-info" style={{ width: "fit-content", fontSize: "10px", padding: "1px 6px", marginBottom: "4px" }}>
                    {item.category}
                  </span>
                  <h4 style={{ fontSize: "var(--text-lg)", fontWeight: "600", color: "var(--text-primary)" }}>
                    {item.name}
                  </h4>
                  {item.description && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "2px", maxWidth: "550px" }}>
                      {item.description}
                    </p>
                  )}
                  <div style={{ marginTop: "6px", fontWeight: "700", fontSize: "var(--text-base)", color: "white" }}>
                    ₹{item.price.toFixed(2)}
                  </div>
                </div>

                {/* Add to Cart Actions */}
                <div style={{ flexShrink: 0 }}>
                  {quantity > 0 ? (
                    <div
                      className="glass"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-md)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--primary)",
                        padding: "4px 8px",
                      }}
                    >
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "4px 8px", minWidth: "24px" }}
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: "700", color: "var(--primary)", minWidth: "16px", textAlign: "center" }}>
                        {quantity}
                      </span>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "4px 8px", minWidth: "24px" }}
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ gap: "4px", padding: "0.5rem 1rem" }}
                      onClick={() =>
                        addToCart(
                          { id: item.id, name: item.name, price: item.price, isVeg: item.isVeg, category: item.category },
                          restaurant.id,
                          restaurant.name
                        )
                      }
                      disabled={!item.available}
                    >
                      {item.available ? (
                        <>
                          <Plus size={16} />
                          <span>Add</span>
                        </>
                      ) : (
                        <span>Sold Out</span>
                      )}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
