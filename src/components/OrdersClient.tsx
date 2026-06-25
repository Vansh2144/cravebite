"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingBag, MapPin, Calendar, CreditCard, ChevronRight } from "lucide-react";

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
  createdAt: Date | string;
  restaurant: {
    name: string;
  };
  orderItems: OrderItem[];
}

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    initialOrders.length > 0 ? initialOrders[0].id : null
  );

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PREPARING":
        return 1;
      case "OUT_FOR_DELIVERY":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return -1;
    }
  };

  const steps = ["Order Placed", "Preparing Food", "Out for Delivery", "Delivered"];

  return (
    <div className="flex-col" style={{ gap: "var(--space-md)", width: "100%" }}>
      
      <div style={{ marginBottom: "var(--space-xs)" }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "700" }}>Order History & Live Tracking</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          Track active deliveries and review your culinary history.
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          className="glass"
          style={{
            padding: "var(--space-4xl) var(--space-xl)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <ShoppingBag size={48} color="var(--text-tertiary)" style={{ marginBottom: "var(--space-md)" }} />
          <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "600" }}>No orders yet</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Your order history is empty. Time to order something delicious!
          </p>
        </div>
      ) : (
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStep = getStatusStep(order.status);
            const isCancelled = order.status === "CANCELLED";

            return (
              <div
                key={order.id}
                className="glass-card"
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: isExpanded ? "1px solid var(--primary-glow)" : "1px solid var(--border-subtle)",
                  overflow: "hidden",
                }}
              >
                {/* Header Info */}
                <div className="order-card-header" onClick={() => toggleExpand(order.id)}>
                  <div className="flex-col" style={{ gap: "4px" }}>
                    <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center", flexWrap: "wrap" }}>
                      <h4 style={{ fontSize: "var(--text-lg)", fontWeight: "700" }}>
                        {order.restaurant.name}
                      </h4>
                      
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

                    <div style={{ display: "flex", gap: "var(--space-md)", fontSize: "var(--text-xs)", color: "var(--text-secondary)", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <Calendar size={12} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Order ID: #{order.id.slice(-8).toUpperCase()}</span>
                      <span>•</span>
                      <strong style={{ color: "white" }}>₹{order.totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div>
                    {isExpanded ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="order-card-details">
                    
                    {/* Live Tracking Progress Bar (if active order) */}
                    {!isCancelled && currentStep < 3 && (
                      <div className="tracking-container">
                        <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "700", marginBottom: "var(--space-md)", color: "var(--primary)" }}>
                          Live Delivery Tracking
                        </h4>
                        
                        <div className="tracking-steps">
                          {/* Progress Line bar */}
                          <div className="tracking-line hide-mobile"></div>
                          <div
                            className="tracking-line-progress hide-mobile"
                            style={{
                              width: `${(currentStep / (steps.length - 1)) * 100}%`,
                            }}
                          ></div>

                          {steps.map((label, index) => {
                            const isCompleted = index < currentStep;
                            const isActive = index === currentStep;
                            
                            return (
                              <div
                                key={label}
                                className={`tracking-step ${
                                  isCompleted ? "completed" : isActive ? "active" : ""
                                }`}
                              >
                                <div className="step-node">
                                  {isCompleted ? (
                                    <span style={{ color: "black", fontSize: "12px", fontWeight: "bold" }}>✓</span>
                                  ) : (
                                    <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>{index + 1}</span>
                                  )}
                                </div>
                                <span className="step-label">{label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Receipt breakdown list */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "var(--space-lg)", flexWrap: "wrap" }}>
                      
                      {/* Items */}
                      <div className="flex-col" style={{ gap: "var(--space-sm)" }}>
                        <h5 style={{ fontWeight: "700", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                          Items Ordered
                        </h5>
                        <div className="flex-col" style={{ gap: "6px" }}>
                          {order.orderItems.map((item) => (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.menuItem.isVeg ? "#4ADE80" : "#F87171" }}></div>
                                <span>{item.menuItem.name}</span>
                                <span style={{ color: "var(--text-secondary)" }}>x{item.quantity}</span>
                              </div>
                              <span style={{ fontWeight: "500" }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary & Shipping details */}
                      <div className="glass" style={{ padding: "var(--space-md)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)", fontSize: "var(--text-xs)" }}>
                        
                        <div className="flex-col" style={{ gap: "2px" }}>
                          <span style={{ color: "var(--text-tertiary)", fontWeight: "600" }}>DELIVERY ADDRESS</span>
                          <span style={{ color: "var(--text-secondary)", display: "flex", gap: "4px", alignItems: "start" }}>
                            <MapPin size={12} style={{ marginTop: "2px", flexShrink: 0 }} />
                            <span>{order.deliveryAddress}</span>
                          </span>
                        </div>

                        <div className="flex-col" style={{ gap: "2px" }}>
                          <span style={{ color: "var(--text-tertiary)", fontWeight: "600" }}>PAYMENT STATUS</span>
                          <span style={{ color: "var(--text-secondary)", display: "flex", gap: "4px", alignItems: "center" }}>
                            <CreditCard size={12} />
                            <span>{order.paymentStatus}</span>
                          </span>
                        </div>

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
