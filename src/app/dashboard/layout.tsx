"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, MapPin, Star, User, Utensils, ClipboardList, Store } from "lucide-react";
import "./dashboard.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "CUSTOMER";

  const customerLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { name: "Reviews", href: "/dashboard/reviews", icon: Star },
  ];

  const restaurantLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Menu", href: "/dashboard/menu", icon: Utensils },
    { name: "Manage Orders", href: "/dashboard/orders", icon: ClipboardList },
    { name: "Restaurant Profile", href: "/dashboard/restaurant-profile", icon: Store },
  ];

  const links = role === "RESTAURANT" ? restaurantLinks : customerLinks;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <span className="sidebar-title">Dashboard</span>
          <nav className="sidebar-menu">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
