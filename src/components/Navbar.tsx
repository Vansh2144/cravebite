"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Coffee, ShoppingBag, User, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className="glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: "var(--z-sticky)",
        width: "100%",
        height: "70px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid var(--border-subtle)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="container flex-between" style={{ height: "100%" }}>
        {/* Logo */}
        <Link
          href="/"
          className="flex-center"
          style={{
            gap: "var(--space-sm)",
            fontSize: "var(--text-xl)",
            fontWeight: 800,
            fontFamily: "var(--font-display)",
          }}
        >
          <Coffee size={26} color="var(--primary)" />
          <span>Crave<span className="text-gradient">Bite</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hide-mobile flex-center" style={{ gap: "var(--space-xl)" }}>
          <Link href="/restaurants" className="font-medium hover-underline" style={{ color: "var(--text-secondary)" }}>
            Restaurants
          </Link>
          <Link href="/#offers" className="font-medium hover-underline" style={{ color: "var(--text-secondary)" }}>
            Offers
          </Link>
          {session && (
            <Link href="/dashboard" className="font-medium hover-underline" style={{ color: "var(--text-secondary)" }}>
              Dashboard
            </Link>
          )}
        </div>

        {/* User & Cart CTA Actions */}
        <div className="hide-mobile flex-center" style={{ gap: "var(--space-md)" }}>
          {/* Cart Icon */}
          <Link
            href="/checkout"
            className="btn btn-secondary btn-icon relative"
            style={{ borderRadius: "var(--radius-full)" }}
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--bg-primary)",
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* Session Profile / Login CTA */}
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <Link href="/dashboard" className="btn btn-secondary" style={{ gap: "var(--space-sm)" }}>
                <User size={16} />
                <span>Hi, {session.user?.name?.split(" ")[0] || "User"}</span>
              </Link>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Login / Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="hide-desktop btn btn-ghost btn-icon"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div
          className="glass-strong animate-fade-in"
          style={{
            position: "absolute",
            top: "70px",
            left: 0,
            width: "100%",
            padding: "var(--space-lg) var(--space-md)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
            borderBottom: "1px solid var(--border-medium)",
          }}
        >
          <Link
            href="/restaurants"
            onClick={toggleMenu}
            className="font-semibold"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Restaurants
          </Link>
          <Link
            href="/#offers"
            onClick={toggleMenu}
            className="font-semibold"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Offers
          </Link>
          {session && (
            <Link
              href="/dashboard"
              onClick={toggleMenu}
              className="font-semibold"
              style={{ fontSize: "var(--text-lg)" }}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/checkout"
            onClick={toggleMenu}
            className="btn btn-secondary"
            style={{ justifyContent: "center" }}
          >
            <ShoppingBag size={18} />
            <span>Cart ({totalItems} items)</span>
          </Link>
          {session ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <div
                style={{
                  padding: "var(--space-sm)",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                }}
              >
                Logged in as <strong>{session.user?.name}</strong>
              </div>
              <button
                className="btn btn-danger"
                style={{ justifyContent: "center" }}
                onClick={() => {
                  toggleMenu();
                  signOut({ callbackUrl: "/" });
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={toggleMenu}
              className="btn btn-primary"
              style={{ justifyContent: "center" }}
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
