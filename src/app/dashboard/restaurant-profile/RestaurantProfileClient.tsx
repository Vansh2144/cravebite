"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Loader2, MapPin, Save, Store, Utensils } from "lucide-react";

interface RestaurantInfo {
  name: string;
  cuisine: string;
  address: string;
  deliveryTime: number;
}

interface RestaurantProfileClientProps {
  restaurant: RestaurantInfo;
}

export default function RestaurantProfileClient({ restaurant }: RestaurantProfileClientProps) {
  const [formData, setFormData] = useState({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    address: restaurant.address,
    deliveryTime: restaurant.deliveryTime.toString(),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const deliveryTimeNum = parseInt(formData.deliveryTime);
    if (isNaN(deliveryTimeNum) || deliveryTimeNum < 5 || deliveryTimeNum > 180) {
      setError("Average delivery time must be between 5 and 180 minutes.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/restaurant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          deliveryTime: deliveryTimeNum,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update restaurant profile.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-col" style={{ gap: "var(--space-lg)", width: "100%", maxWidth: "600px" }}>
      <div>
        <h2 style={{ fontSize: "var(--text-2xl)", fontFamily: "var(--font-display)", fontWeight: "800" }}>
          Restaurant <span className="text-gradient">Profile</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          Manage your storefront details that customers see when ordering.
        </p>
      </div>

      {error && (
        <div className="auth-alert-error" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="auth-alert-success" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 size={18} />
          <span>Store details updated successfully!</span>
        </div>
      )}

      <div
        className="glass-card"
        style={{
          padding: "var(--space-xl)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <form onSubmit={handleSubmit} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          
          {/* Restaurant Name */}
          <div className="input-group">
            <label className="input-label" htmlFor="name">
              Restaurant Name
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-tertiary)",
                }}
              >
                <Store size={18} />
              </span>
              <input
                className="input w-full"
                style={{ paddingLeft: "40px" }}
                id="name"
                type="text"
                placeholder="e.g. La Bella Italia"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Cuisine Selection */}
          <div className="input-group">
            <label className="input-label" htmlFor="cuisine">
              Cuisine Specialty
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-tertiary)",
                  zIndex: 10,
                }}
              >
                <Utensils size={18} />
              </span>
              <select
                className="input w-full"
                style={{ paddingLeft: "40px", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                id="cuisine"
                value={formData.cuisine}
                onChange={(e) => setFormData((prev) => ({ ...prev, cuisine: e.target.value }))}
                required
              >
                <option value="Italian">🍕 Italian</option>
                <option value="Indian">🍛 Indian</option>
                <option value="Chinese">🥢 Chinese</option>
                <option value="Fast Food">🍔 Fast Food</option>
                <option value="Healthy">🥗 Healthy</option>
                <option value="Japanese">🍣 Japanese</option>
                <option value="Mexican">🌮 Mexican</option>
                <option value="Cafe">☕ Cafe</option>
              </select>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="input-group">
            <label className="input-label" htmlFor="deliveryTime">
              Average Delivery Time (minutes)
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-tertiary)",
                }}
              >
                <Clock size={18} />
              </span>
              <input
                className="input w-full"
                style={{ paddingLeft: "40px" }}
                id="deliveryTime"
                type="number"
                min="5"
                max="180"
                placeholder="30"
                value={formData.deliveryTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="input-group">
            <label className="input-label" htmlFor="address">
              Store Address
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "22px",
                  color: "var(--text-tertiary)",
                }}
              >
                <MapPin size={18} />
              </span>
              <textarea
                className="input w-full"
                style={{ paddingLeft: "40px", minHeight: "80px", resize: "vertical" }}
                id="address"
                placeholder="Restaurant street address, city, postcode"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving}
            style={{ width: "fit-content", gap: "6px", alignSelf: "flex-end", marginTop: "var(--space-sm)" }}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Store...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Store Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
