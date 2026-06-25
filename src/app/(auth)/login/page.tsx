"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [role, setRole] = useState<"CUSTOMER" | "RESTAURANT">("CUSTOMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">
          {role === "CUSTOMER" ? "Customer Portal" : "Partner Portal"}
        </h1>
        <p className="auth-subtitle">
          Don&apos;t have an account? <Link href="/register">Register here</Link>
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

      <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Login to Account</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
