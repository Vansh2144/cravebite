import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Compass, ShoppingBag, MapPin, User, Mail, Phone, Utensils, Award, DollarSign, Star, ClipboardList } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch user role from DB
  const user = await db.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    redirect("/login");
  }

  // ── RESTAURANT DASHBOARD VIEW ──
  if (user.role === "RESTAURANT") {
    const restaurant = await db.restaurant.findUnique({
      where: { userId: user.id },
      include: {
        menuItems: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            user: true,
            orderItems: {
              include: { menuItem: true },
            },
          },
        },
      },
    });

    if (!restaurant) {
      redirect("/dashboard/restaurant-profile");
    }

    const activeOrders = restaurant.orders.filter(
      (order) => order.status !== "DELIVERED" && order.status !== "CANCELLED"
    );

    const totalEarnings = restaurant.orders
      .filter((order) => order.status === "DELIVERED")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return (
      <div className="flex-col" style={{ gap: "var(--space-xl)", width: "100%" }}>
        {/* Welcome Card Banner */}
        <div className="welcome-banner">
          <h2 style={{ fontSize: "var(--text-3xl)", fontFamily: "var(--font-display)", fontWeight: "800", color: "white" }}>
            Welcome back, <span className="text-gradient">{restaurant.name}</span>!
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "var(--text-sm)" }}>
            Manage your menu, view active orders, and track your restaurant's performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid-responsive grid-4" style={{ gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
          <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <div style={{ padding: "12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
              <ClipboardList size={24} />
            </div>
            <div className="flex-col">
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>ACTIVE ORDERS</span>
              <strong style={{ fontSize: "var(--text-2xl)", color: "white" }}>{activeOrders.length}</strong>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <div style={{ padding: "12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
              <Utensils size={24} />
            </div>
            <div className="flex-col">
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>MENU ITEMS</span>
              <strong style={{ fontSize: "var(--text-2xl)", color: "white" }}>{restaurant.menuItems.length}</strong>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <div style={{ padding: "12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
              <DollarSign size={24} />
            </div>
            <div className="flex-col">
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>TOTAL EARNINGS</span>
              <strong style={{ fontSize: "var(--text-2xl)", color: "white" }}>₹{totalEarnings.toFixed(2)}</strong>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <div style={{ padding: "12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
              <Star size={24} />
            </div>
            <div className="flex-col">
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>RATING</span>
              <strong style={{ fontSize: "var(--text-2xl)", color: "white" }}>{restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "N/A"}</strong>
            </div>
          </div>
        </div>

        <div className="grid-responsive" style={{ gridTemplateColumns: "1.8fr 1.2fr", gap: "var(--space-xl)", alignItems: "start" }}>
          {/* Left Side: Active Incoming Orders */}
          <div className="flex-col" style={{ gap: "var(--space-md)" }}>
            <div className="flex-between">
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "700" }}>Active Incoming Orders</h3>
              <Link href="/dashboard/orders" className="btn btn-ghost btn-sm" style={{ gap: "4px" }}>
                <span>Manage All Orders</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {activeOrders.length === 0 ? (
              <div className="glass" style={{ padding: "var(--space-2xl)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
                <ShoppingBag size={36} color="var(--text-tertiary)" style={{ marginBottom: "var(--space-sm)" }} />
                <h4 style={{ fontSize: "var(--text-base)", fontWeight: "600" }}>All caught up!</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-xs)", marginTop: "4px" }}>
                  No active orders at the moment. New orders will appear here.
                </p>
              </div>
            ) : (
              <div className="flex-col" style={{ gap: "var(--space-md)" }}>
                {activeOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="glass-card"
                    style={{
                      padding: "var(--space-lg)",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="flex-col" style={{ gap: "2px" }}>
                      <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                        <strong style={{ fontSize: "var(--text-base)" }}>{order.user.name}</strong>
                        <span className="badge badge-primary">{order.status}</span>
                      </div>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                        {new Date(order.createdAt).toLocaleTimeString()} — {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginTop: "4px" }}>
                        Items: {order.orderItems.map((item) => `${item.menuItem.name} x${item.quantity}`).join(", ")}
                      </div>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                        Total Amount: <strong>₹{order.totalAmount.toFixed(2)}</strong>
                      </span>
                    </div>

                    <Link href="/dashboard/orders" className="btn btn-secondary btn-sm">
                      Update Status
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Store Summary card */}
          <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", gap: "var(--space-md)" }}>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "700", marginBottom: "var(--space-md)" }}>
              Store Overview
            </h3>
            <div className="flex-col" style={{ gap: "var(--space-md)" }}>
              <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                <div style={{ padding: "8px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
                  <Award size={18} />
                </div>
                <div className="flex-col">
                  <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>STORE NAME</span>
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: "600" }}>{restaurant.name}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                <div style={{ padding: "8px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
                  <Utensils size={18} />
                </div>
                <div className="flex-col">
                  <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>CUISINE</span>
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: "600" }}>{restaurant.cuisine}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                <div style={{ padding: "8px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
                  <MapPin size={18} />
                </div>
                <div className="flex-col">
                  <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>ADDRESS</span>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {restaurant.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CUSTOMER DASHBOARD VIEW ──
  const customer = await db.user.findUnique({
    where: { id: user.id },
    include: {
      orders: {
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { restaurant: true },
      },
    },
  });

  if (!customer) {
    redirect("/login");
  }

  return (
    <div className="flex-col" style={{ gap: "var(--space-xl)", width: "100%" }}>
      {/* Welcome Card Banner */}
      <div className="welcome-banner">
        <h2 style={{ fontSize: "var(--text-3xl)", fontFamily: "var(--font-display)", fontWeight: "800", color: "white" }}>
          Welcome back, <span className="text-gradient">{customer.name}</span>!
        </h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "var(--text-sm)" }}>
          Craving something delicious? Order fresh meals from your favorite restaurants today.
        </p>
      </div>

      <div className="grid-responsive" style={{ gridTemplateColumns: "1.8fr 1.2fr", gap: "var(--space-xl)", alignItems: "start" }}>
        {/* Left Side: Recent & Active Orders */}
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          <div className="flex-between">
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "700" }}>Active & Recent Orders</h3>
            <Link href="/dashboard/orders" className="btn btn-ghost btn-sm" style={{ gap: "4px" }}>
              <span>View All Orders</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {customer.orders.length === 0 ? (
            <div className="glass" style={{ padding: "var(--space-2xl)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
              <ShoppingBag size={36} color="var(--text-tertiary)" style={{ marginBottom: "var(--space-sm)" }} />
              <h4 style={{ fontSize: "var(--text-base)", fontWeight: "600" }}>No orders placed yet</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-xs)", margin: "4px 0 var(--space-md) 0" }}>
                Explore top restaurants and try out mouth-watering cuisines!
              </p>
              <Link href="/restaurants" className="btn btn-primary btn-sm" style={{ gap: "var(--space-xs)" }}>
                <Compass size={14} />
                <span>Browse Restaurants</span>
              </Link>
            </div>
          ) : (
            <div className="flex-col" style={{ gap: "var(--space-md)" }}>
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="glass-card"
                  style={{
                    padding: "var(--space-lg)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="flex-col" style={{ gap: "2px" }}>
                    <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                      <strong style={{ fontSize: "var(--text-base)" }}>{order.restaurant.name}</strong>
                      <span
                        className={`badge ${
                          order.status === "DELIVERED"
                            ? "badge-success"
                            : order.status === "CANCELLED"
                            ? "badge-danger"
                            : "badge-primary"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                      Total Amount: <strong>₹{order.totalAmount.toFixed(2)}</strong>
                    </span>
                  </div>
                  
                  <Link href="/dashboard/orders" className="btn btn-secondary btn-sm">
                    Track Order
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Profile Summary card */}
        <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", gap: "var(--space-md)" }}>
          <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "700", marginBottom: "var(--space-md)" }}>
            Profile Overview
          </h3>
          <div className="flex-col" style={{ gap: "var(--space-md)" }}>
            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <div style={{ padding: "8px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
                <User size={18} />
              </div>
              <div className="flex-col">
                <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>NAME</span>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "600" }}>{customer.name}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <div style={{ padding: "8px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
                <Mail size={18} />
              </div>
              <div className="flex-col">
                <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>EMAIL</span>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "600" }}>{customer.email}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <div style={{ padding: "8px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
                <Phone size={18} />
              </div>
              <div className="flex-col">
                <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>PHONE</span>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "600" }}>{customer.phone || "Not provided"}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <div style={{ padding: "8px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", color: "var(--primary)" }}>
                <MapPin size={18} />
              </div>
              <div className="flex-col">
                <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>DEFAULT ADDRESS</span>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {customer.defaultAddress || "No default address set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
