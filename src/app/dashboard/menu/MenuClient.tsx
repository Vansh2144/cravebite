"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, Loader2, Utensils, Check, X } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  isVeg: boolean;
  available: boolean;
}

interface MenuClientProps {
  initialMenuItems: MenuItem[];
}

export default function MenuClient({ initialMenuItems }: MenuClientProps) {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Mains",
    isVeg: true,
    available: true,
  });

  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Mains",
      isVeg: true,
      available: true,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      available: item.available,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleToggleAvailable = async (itemId: string, currentAvailable: boolean) => {
    setTogglingId(itemId);
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          available: !currentAvailable,
        }),
      });

      if (response.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, available: !currentAvailable } : i))
        );
      }
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Please enter a valid price.");
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      price: priceNum,
      category: formData.category,
      isVeg: formData.isVeg,
      available: formData.available,
    };

    try {
      if (editingItem) {
        const response = await fetch(`/api/menu-items/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to update menu item.");
        } else {
          setItems((prev) =>
            prev.map((i) => (i.id === editingItem.id ? data.menuItem : i))
          );
          setIsModalOpen(false);
        }
      } else {
        const response = await fetch("/api/menu-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to add menu item.");
        } else {
          setItems((prev) => [data.menuItem, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === "All"
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <div className="flex-col" style={{ gap: "var(--space-lg)", width: "100%" }}>
      <div className="flex-between">
        <div>
          <h2 style={{ fontSize: "var(--text-2xl)", fontFamily: "var(--font-display)", fontWeight: "800" }}>
            Manage Store <span className="text-gradient">Menu</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            List, update, and manage your dishes, availability, prices, and categories.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ gap: "6px" }}>
          <Plus size={18} />
          <span>Add Dish</span>
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-xs)",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "var(--space-xs)",
          overflowX: "auto",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="btn btn-ghost btn-sm"
            style={{
              background: activeCategory === cat ? "var(--bg-glass-strong)" : "transparent",
              color: activeCategory === cat ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: activeCategory === cat ? "700" : "500",
              borderRadius: "var(--radius-md)",
              whiteSpace: "nowrap",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div
          className="glass"
          style={{
            padding: "var(--space-2xl)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            textAlign: "center",
          }}
        >
          <Utensils size={36} color="var(--text-tertiary)" style={{ marginBottom: "var(--space-sm)" }} />
          <h4 style={{ fontSize: "var(--text-base)", fontWeight: "600" }}>No menu items found</h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-xs)", marginTop: "4px" }}>
            Create some delicious food offerings by clicking "Add Dish" above.
          </p>
        </div>
      ) : (
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          {filteredItems.map((item) => (
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
                opacity: item.available ? 1 : 0.6,
                transition: "opacity var(--transition-base)",
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
                <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                  <span className="badge badge-info" style={{ fontSize: "10px", padding: "1px 6px" }}>
                    {item.category}
                  </span>
                  {!item.available && (
                    <span className="badge badge-danger" style={{ fontSize: "10px", padding: "1px 6px" }}>
                      SOLD OUT
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: "var(--text-lg)", fontWeight: "600", color: "var(--text-primary)", marginTop: "4px" }}>
                  {item.name}
                </h4>
                {item.description && (
                  <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "2px", maxWidth: "600px" }}>
                    {item.description}
                  </p>
                )}
                <div style={{ marginTop: "6px", fontWeight: "700", fontSize: "var(--text-base)", color: "white" }}>
                  ₹{item.price.toFixed(2)}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center", flexShrink: 0 }}>
                {/* Availability Toggle */}
                <button
                  className={`btn ${item.available ? "btn-outline" : "btn-secondary"}`}
                  style={{ fontSize: "var(--text-xs)", padding: "6px 12px", minWidth: "100px" }}
                  disabled={togglingId === item.id}
                  onClick={() => handleToggleAvailable(item.id, item.available)}
                >
                  {togglingId === item.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : item.available ? (
                    "Mark Sold Out"
                  ) : (
                    "Mark Available"
                  )}
                </button>

                {/* Edit Button */}
                <button
                  className="btn btn-secondary btn-icon"
                  onClick={() => handleOpenEditModal(item)}
                  title="Edit Dish"
                >
                  <Edit2 size={16} />
                </button>

                {/* Delete Button */}
                <button
                  className="btn btn-ghost btn-icon"
                  style={{ color: "var(--danger)" }}
                  onClick={() => handleDeleteItem(item.id)}
                  title="Delete Dish"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "var(--space-xl)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-medium)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
            }}
          >
            <div className="flex-between" style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-sm)" }}>
              <h3 style={{ fontSize: "var(--text-xl)", fontFamily: "var(--font-display)", fontWeight: "800" }}>
                {editingItem ? "Edit Menu Dish" : "Add New Dish"}
              </h3>
              <button
                className="btn btn-ghost btn-icon"
                style={{ padding: 0, minWidth: "unset", height: "unset" }}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="auth-alert-error" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div className="input-group">
                <label className="input-label">Dish Name</label>
                <input
                  className="input w-full"
                  type="text"
                  placeholder="e.g. Garlic Bread"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Price (₹)</label>
                <input
                  className="input w-full"
                  type="number"
                  placeholder="e.g. 199"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  className="input w-full"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  required
                  style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                >
                  <option value="Starters">🍲 Starters</option>
                  <option value="Mains">🍛 Mains</option>
                  <option value="Sides">🍟 Sides</option>
                  <option value="Breads">🍞 Breads</option>
                  <option value="Desserts">🍨 Desserts</option>
                  <option value="Beverages">🥤 Beverages</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Description (Optional)</label>
                <textarea
                  className="input w-full"
                  style={{ minHeight: "60px", resize: "vertical" }}
                  placeholder="Describe your dish ingredients or style..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", gap: "var(--space-lg)", margin: "var(--space-xs) 0" }}>
                {/* Veg Toggle */}
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "var(--text-sm)" }}>
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isVeg: e.target.checked }))}
                    style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                  />
                  <span>Veg Dish</span>
                </label>

                {/* Available Toggle */}
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "var(--text-sm)" }}>
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.checked }))}
                    style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                  />
                  <span>Available In Stock</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-sm)" }}>
                <button
                  type="button"
                  className="btn btn-secondary w-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                  style={{ justifyContent: "center" }}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : editingItem ? (
                    "Update Dish"
                  ) : (
                    "Add Dish"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
