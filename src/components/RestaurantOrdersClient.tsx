"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Clock, MapPin, Phone, User, DollarSign, Loader2 } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    isVeg: boolean;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  deliveryAddress: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  orderItems: OrderItem[];
}

interface RestaurantOrdersClientProps {
  initialOrders: Order[];
}

export default function RestaurantOrdersClient({ initialOrders }: RestaurantOrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoadingOrderId(orderId);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update order status.");
      } else {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "badge-success";
      case "CANCELLED":
        return "badge-danger";
      case "PENDING":
        return "badge-warning";
      case "PREPARING":
        return "badge-info";
      case "SENT":
        return "badge-primary";
      default:
        return "";
    }
  };

  const filteredOrders = activeTab === "ALL"
    ? orders
    : orders.filter((o) => {
        if (activeTab === "ACTIVE") {
          return o.status !== "DELIVERED" && o.status !== "CANCELLED";
        }
        return o.status === activeTab;
      });

  return (
    <div className="flex-col" style={{ gap: "var(--space-lg)", width: "100%" }}>
      <div className="flex-between">
        <div>
          <h2 style={{ fontSize: "var(--text-2xl)", fontFamily: "var(--font-display)", fontWeight: "800" }}>
            Manage Incoming <span className="text-gradient">Orders</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Review, prepare, and coordinate order deliveries for your customers.
          </p>
        </div>
      </div>

      {error && (
        <div className="auth-alert-error" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

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
        {[
          { id: "ALL", label: "All Orders" },
          { id: "ACTIVE", label: "Active" },
          { id: "PENDING", label: "Pending" },
          { id: "PREPARING", label: "Preparing" },
          { id: "SENT", label: "Out for Delivery" },
          { id: "DELIVERED", label: "Completed" },
          { id: "CANCELLED", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn btn-ghost btn-sm"
            style={{
              background: activeTab === tab.id ? "var(--bg-glass-strong)" : "transparent",
              color: activeTab === tab.id ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: activeTab === tab.id ? "700" : "500",
              borderRadius: "var(--radius-md)",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div
          className="glass"
          style={{
            padding: "var(--space-2xl)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            textAlign: "center",
          }}
        >
          <Clock size={36} color="var(--text-tertiary)" style={{ marginBottom: "var(--space-sm)" }} />
          <h4 style={{ fontSize: "var(--text-base)", fontWeight: "600" }}>No orders found</h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-xs)", marginTop: "4px" }}>
            There are no orders matching this filter at the moment.
          </p>
        </div>
      ) : (
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          {filteredOrders.map((order) => {
            const isExpanded = !!expandedOrders[order.id];
            const isOrderLoading = loadingOrderId === order.id;

            return (
              <div
                key={order.id}
                className="glass-card"
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  className="order-card-header"
                  onClick={() => toggleExpand(order.id)}
                  style={{
                    padding: "var(--space-lg)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex-col" style={{ gap: "4px" }}>
                    <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                      <strong style={{ fontSize: "var(--text-base)", color: "white" }}>
                        Order #{order.id.slice(-6).toUpperCase()}
                      </strong>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`badge ${order.paymentStatus === "PAID" ? "badge-success" : "badge-secondary"}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                      Customer: <strong>{order.customer.name}</strong> ({order.customer.phone})
                    </span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                      Placed: {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Amount</div>
                      <div style={{ fontSize: "var(--text-base)", fontWeight: "800", color: "var(--primary)" }}>
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Details Section */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "var(--space-lg)",
                      borderTop: "1px solid var(--border-subtle)",
                      background: "rgba(0, 0, 0, 0.15)",
                      gap: "var(--space-lg)",
                    }}
                    className="flex-col"
                  >
                    {/* Items List */}
                    <div className="flex-col" style={{ gap: "var(--space-sm)" }}>
                      <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "700", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "4px" }}>
                        ITEMS ORDERED
                      </h4>
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "var(--text-sm)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: item.menuItem.isVeg ? "#4ADE80" : "#F87171",
                              }}
                            ></span>
                            <span>
                              {item.menuItem.name} <strong>x{item.quantity}</strong>
                            </span>
                          </div>
                          <span style={{ fontWeight: "600", color: "white" }}>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid-responsive grid-2" style={{ gap: "var(--space-md)" }}>
                      <div className="flex-col" style={{ gap: "6px" }}>
                        <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "700", color: "var(--text-secondary)" }}>
                          Delivery Address
                        </h4>
                        <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                          <MapPin size={14} style={{ marginTop: "2px", flexShrink: 0 }} />
                          <p>{order.deliveryAddress}</p>
                        </div>
                      </div>

                      <div className="flex-col" style={{ gap: "6px" }}>
                        <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "700", color: "var(--text-secondary)" }}>
                          Customer Contact
                        </h4>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                          <User size={14} />
                          <span>{order.customer.name} ({order.customer.email})</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                          <Phone size={14} />
                          <span>{order.customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Status Control Pipeline */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid var(--border-subtle)",
                        paddingTop: "var(--space-md)",
                        gap: "var(--space-md)",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                        Order Pipeline Actions
                      </div>

                      <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                        {isOrderLoading ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontSize: "var(--text-xs)" }}>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <>
                            {order.status === "PENDING" && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => updateOrderStatus(order.id, "PREPARING")}
                              >
                                Accept & Prepare
                              </button>
                            )}

                            {order.status === "PREPARING" && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => updateOrderStatus(order.id, "SENT")}
                              >
                                Dispatch Order
                              </button>
                            )}

                            {order.status === "SENT" && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                              >
                                Mark Delivered
                              </button>
                            )}

                            {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                              <button
                                className="btn btn-danger btn-sm"
                                style={{ background: "transparent", border: "1px solid var(--danger)", color: "var(--danger)" }}
                                onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                              >
                                Cancel Order
                              </button>
                            )}

                            {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
                              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>
                                <CheckCircle2 size={14} />
                                <span>Finalized state</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
