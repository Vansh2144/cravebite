"use client";

import Link from "next/link";
import { Coffee, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass" style={{ borderTop: "1px solid var(--border-subtle)", padding: "var(--space-2xl) 0 var(--space-xl) 0", marginTop: "auto" }}>
      <div className="container grid-responsive grid-4">
        {/* Info Column */}
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          <Link href="/" className="flex-center" style={{ gap: "var(--space-sm)", justifyContent: "flex-start", fontSize: "var(--text-xl)", fontWeight: "800", fontFamily: "var(--font-display)" }}>
            <Coffee size={24} color="var(--primary)" />
            <span>Crave<span className="text-gradient">Bite</span></span>
          </Link>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Cravings delivered fast. Order fresh, premium meals from the finest local restaurants directly to your doorstep.
          </p>
          <div style={{ display: "flex", gap: "var(--space-md)" }}>
            <a href="#" className="btn-ghost" style={{ padding: "var(--space-xs)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)" }}>
              <Instagram size={20} />
            </a>
            <a href="#" className="btn-ghost" style={{ padding: "var(--space-xs)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)" }}>
              <Facebook size={20} />
            </a>
            <a href="#" className="btn-ghost" style={{ padding: "var(--space-xs)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)" }}>
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontWeight: "600" }}>Quick Links</h4>
          <ul className="flex-col" style={{ gap: "var(--space-sm)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            <li><Link href="/restaurants" style={{ transition: "color var(--transition-fast)" }} className="hover-underline">Browse Restaurants</Link></li>
            <li><Link href="/dashboard" style={{ transition: "color var(--transition-fast)" }} className="hover-underline">My Account</Link></li>
            <li><Link href="/dashboard/orders" style={{ transition: "color var(--transition-fast)" }} className="hover-underline">Track Order</Link></li>
            <li><Link href="#" style={{ transition: "color var(--transition-fast)" }} className="hover-underline">Offers & Discounts</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontWeight: "600" }}>Support & Legal</h4>
          <ul className="flex-col" style={{ gap: "var(--space-sm)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            <li><a href="#" style={{ transition: "color var(--transition-fast)" }}>Terms of Service</a></li>
            <li><a href="#" style={{ transition: "color var(--transition-fast)" }}>Privacy Policy</a></li>
            <li><a href="#" style={{ transition: "color var(--transition-fast)" }}>Refund Policy</a></li>
            <li><a href="#" style={{ transition: "color var(--transition-fast)" }}>Contact Support</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontWeight: "600" }}>Get in Touch</h4>
          <ul className="flex-col" style={{ gap: "var(--space-sm)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            <li style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <MapPin size={16} color="var(--primary)" />
              <span>100 Foodie Court, New Delhi, India</span>
            </li>
            <li style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <Phone size={16} color="var(--primary)" />
              <span>+91 98765 43210</span>
            </li>
            <li style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <Mail size={16} color="var(--primary)" />
              <span>support@cravebite.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="divider"></div>

      <div className="container flex-between" style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>
        <p>&copy; {new Date().getFullYear()} CraveBite. All rights reserved.</p>
        <p>Built with ❤️ for Vibe Coders</p>
      </div>
    </footer>
  );
}
