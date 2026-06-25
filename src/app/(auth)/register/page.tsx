"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Lock, Mail, MapPin, Phone, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"CUSTOMER" | "RESTAURANT">("CUSTOMER");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    defaultAddress: "",
    restaurantName: "",
    cuisine: "Indian",
    deliveryTime: "30",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, phone, defaultAddress, restaurantName, cuisine } = formData;

    if (!name || !email || !password || !phone || !defaultAddress) {
      setError("Please fill in all fields");
      return;
    }

    if (role === "RESTAURANT" && (!restaurantName || !cuisine)) {
      setError("Please provide restaurant name and cuisine type");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        role,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to register. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: "500px" }}>
      <div className="auth-header">
        <h1 className="auth-title">
          {role === "CUSTOMER" ? "Create Account" : "Partner Registration"}
        </h1>
        <p className="auth-subtitle">
          Already have an account? <Link href="/login">Login here</Link>
        </p>
      </div>

      {/* Role Toggle */}
      <div 
        style={{ 
          display: "flex", 
          background: "var(--bg-tertiary)", 
          borderRadius: "var(--radius-md)", 
          padding: "4px", 
          marginBottom: "var(--space-lg)",
          border: "1px solid var(--border-subtle)" 
        }}
      >
        <button
          type="button"
          onClick={() => setRole("CUSTOMER")}
          className="btn"
          style={{
            flex: 1,
            background: role === "CUSTOMER" ? "var(--primary)" : "transparent",
            color: role === "CUSTOMER" ? "white" : "var(--text-secondary)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            fontSize: "var(--text-sm)",
            fontWeight: "600",
            border: "none",
            boxShadow: role === "CUSTOMER" ? "var(--shadow-sm)" : "none",
          }}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => setRole("RESTAURANT")}
          className="btn"
          style={{
            flex: 1,
            background: role === "RESTAURANT" ? "var(--primary)" : "transparent",
            color: role === "RESTAURANT" ? "white" : "var(--text-secondary)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            fontSize: "var(--text-sm)",
            fontWeight: "600",
            border: "none",
            boxShadow: role === "RESTAURANT" ? "var(--shadow-sm)" : "none",
          }}
        >
          Restaurant Owner
        </button>
      </div>

      {error && (
        <div className="auth-alert-error" style={{ marginBottom: "var(--space-md)" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="auth-alert-success" style={{ marginBottom: "var(--space-md)" }}>
          <CheckCircle2 size={18} />
          <span>Registration successful! Redirecting to login...</span>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="name">
            {role === "CUSTOMER" ? "Full Name" : "Owner's Full Name"}
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
              <User size={18} />
            </span>
            <input
              className="input w-full"
              style={{ paddingLeft: "40px" }}
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="email">
            Email Address
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
              <Mail size={18} />
            </span>
            <input
              className="input w-full"
              style={{ paddingLeft: "40px" }}
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="phone">
            Phone Number
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
              <Phone size={18} />
            </span>
            <input
              className="input w-full"
              style={{ paddingLeft: "40px" }}
              id="phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Password
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
              <Lock size={18} />
            </span>
            <input
              className="input w-full"
              style={{ paddingLeft: "40px" }}
              id="password"
              type="password"
              placeholder="•••••••• (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Restaurant Specific Fields */}
        {role === "RESTAURANT" && (
          <>
            <div className="input-group">
              <label className="input-label" htmlFor="restaurantName">
                Restaurant Name
              </label>
              <input
                className="input w-full"
                id="restaurantName"
                type="text"
                placeholder="e.g. Pizza Palace"
                value={formData.restaurantName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="cuisine">
                Cuisine Type
              </label>
              <select
                className="input w-full"
                id="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                required
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
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

            <div className="input-group">
              <label className="input-label" htmlFor="deliveryTime">
                Avg. Delivery Time (minutes)
              </label>
              <input
                className="input w-full"
                id="deliveryTime"
                type="number"
                min="5"
                max="180"
                placeholder="30"
                value={formData.deliveryTime}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div className="input-group">
          <label className="input-label" htmlFor="defaultAddress">
            {role === "CUSTOMER" ? "Default Delivery Address" : "Restaurant Physical Address"}
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
              id="defaultAddress"
              placeholder={
                role === "CUSTOMER"
                  ? "123 Street Name, Apartment, City, Pincode"
                  : "Restaurant physical address, City, Pincode"
              }
              value={formData.defaultAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          className="btn btn-primary auth-btn-submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
