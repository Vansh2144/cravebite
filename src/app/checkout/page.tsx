"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, MapPin, CreditCard, ChevronRight, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, restaurantId, restaurantName, totalAmount, clearCart } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Sandbox modal state
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxData, setSandboxData] = useState<{
    orderId: string;
    razorpayOrderId: string;
    amount: number;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch user profile data on load
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const user = await res.json();
          setDeliveryAddress(user.defaultAddress || "");
          setPhone(user.phone || "");
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!deliveryAddress.trim() || !phone.trim()) {
      setOrderError("Please verify your phone number and delivery address.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          restaurantId,
          deliveryAddress,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.message || "Failed to initiate transaction.");
      }

      if (orderData.isMock) {
        // Launch Mock Sandbox Simulator Modal
        setSandboxData({
          orderId: orderData.orderId,
          razorpayOrderId: orderData.razorpayOrderId,
          amount: orderData.amount,
        });
        setShowSandbox(true);
      } else {
        // Real Razorpay Payment Overlay
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error("Razorpay SDK failed to load. Check your internet connection.");
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_yourkeyhere",
          amount: Math.round(orderData.amount * 100),
          currency: orderData.currency,
          name: "CraveBite",
          description: `Order from ${restaurantName}`,
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            // Call verify API
            setIsPlacingOrder(true);
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              if (verifyRes.ok) {
                clearCart();
                router.push("/dashboard/orders");
              } else {
                const verifyErr = await verifyRes.json();
                setOrderError(verifyErr.message || "Payment verification failed.");
              }
            } catch (err) {
              setOrderError("Payment verification failed. Please contact support.");
            } finally {
              setIsPlacingOrder(false);
            }
          },
          prefill: {
            contact: phone,
          },
          theme: {
            color: "#FF6B35",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      setOrderError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!sandboxData) return;
    setIsVerifying(true);
    setOrderError(null);

    try {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: sandboxData.razorpayOrderId,
          razorpayPaymentId: "pay_mock_" + Math.random().toString(36).substring(2, 10),
          razorpaySignature: "mock_signature",
        }),
      });

      if (verifyRes.ok) {
        clearCart();
        setShowSandbox(false);
        router.push("/dashboard/orders");
      } else {
        const verifyErr = await verifyRes.json();
        setOrderError(verifyErr.message || "Failed to verify sandbox signature.");
        setShowSandbox(false);
      }
    } catch (err) {
      setOrderError("Payment simulation failed.");
      setShowSandbox(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Fees calculations
  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const gstTax = totalAmount * 0.05;
  const finalTotal = totalAmount + deliveryFee + gstTax;

  if (cartItems.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main className="section flex-center flex-col" style={{ flexGrow: 1, background: "var(--bg-primary)" }}>
          <ShoppingBag size={64} color="var(--text-tertiary)" style={{ marginBottom: "var(--space-md)" }} />
          <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "600" }}>Your Cart is Empty</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-md)", textAlign: "center" }}>
            Add delicious items from your favorite restaurants to checkout!
          </p>
          <button className="btn btn-primary" onClick={() => router.push("/restaurants")}>
            Browse Restaurants
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <main className="section" style={{ flexGrow: 1, background: "var(--bg-primary)" }}>
        <div className="container">
          
          <h1 style={{ fontSize: "var(--text-3xl)", fontFamily: "var(--font-display)", fontWeight: "800", marginBottom: "var(--space-xl)" }}>
            Review <span className="text-gradient">Your Order</span>
          </h1>

          <div className="grid-responsive" style={{ gridTemplateColumns: "1.5fr 1fr", gap: "var(--space-xl)", alignItems: "start" }}>
            
            {/* Left side — Cart Items & Address */}
            <div className="flex-col" style={{ gap: "var(--space-lg)" }}>
              
              {/* Order from banner */}
              <div className="glass" style={{ padding: "var(--space-md) var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-medium)" }}>
                Ordering from <strong style={{ color: "var(--primary)" }}>{restaurantName}</strong>
              </div>

              {/* Items Card */}
              <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "600", marginBottom: "var(--space-md)" }}>
                  Order Details
                </h3>
                
                <div className="flex-col" style={{ gap: "var(--space-md)" }}>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex-between">
                      <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.isVeg ? "#4ADE80" : "#F87171" }}></div>
                        <span style={{ fontWeight: "500" }}>{item.name}</span>
                        <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>x{item.quantity}</span>
                      </div>
                      <span style={{ fontWeight: "600" }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "600", marginBottom: "var(--space-md)", display: "flex", gap: "var(--space-xs)", alignItems: "center" }}>
                  <MapPin size={18} color="var(--primary)" />
                  <span>Delivery Address</span>
                </h3>

                {isLoadingProfile ? (
                  <div className="flex-center" style={{ padding: "var(--space-md)" }}>
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="flex-col" style={{ gap: "var(--space-md)" }}>
                    
                    <div className="input-group">
                      <label className="input-label" htmlFor="phone-number-prefill">Contact Phone Number</label>
                      <input
                        id="phone-number-prefill"
                        className="input"
                        type="text"
                        placeholder="Contact phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" htmlFor="delivery-address-prefill">Delivery Address</label>
                      <textarea
                        id="delivery-address-prefill"
                        className="input"
                        style={{ minHeight: "80px", resize: "vertical" }}
                        placeholder="Input your exact delivery address here"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                      />
                    </div>

                    {orderError && (
                      <div className="auth-alert-error">
                        <span>{orderError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ marginTop: "var(--space-sm)", gap: "var(--space-sm)" }}
                      disabled={isPlacingOrder}
                    >
                      {isPlacingOrder ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Initiating Checkout...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={18} />
                          <span>Pay & Place Order (₹{finalTotal.toFixed(2)})</span>
                        </>
                      )}
                    </button>

                  </form>
                )}
              </div>

            </div>

            {/* Right side — Receipt details summary */}
            <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", position: "sticky", top: "90px" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "600", marginBottom: "var(--space-md)" }}>Bill Details</h3>
              
              <div className="flex-col" style={{ gap: "var(--space-sm)", fontSize: "var(--text-sm)" }}>
                <div className="flex-between">
                  <span style={{ color: "var(--text-secondary)" }}>Item Subtotal</span>
                  <span style={{ fontWeight: "500" }}>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-secondary)" }}>Delivery Fee</span>
                  <span style={{ fontWeight: "500" }}>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-secondary)" }}>GST & Restaurant Charges (5%)</span>
                  <span style={{ fontWeight: "500" }}>₹{gstTax.toFixed(2)}</span>
                </div>
                
                <div className="divider" style={{ margin: "var(--space-sm) 0" }}></div>

                <div className="flex-between" style={{ fontSize: "var(--text-lg)", fontWeight: "700" }}>
                  <span>Grand Total</span>
                  <span style={{ color: "var(--primary)" }}>₹{finalTotal.toFixed(2)}</span>
                </div>

                <div
                  className="glass"
                  style={{
                    marginTop: "var(--space-md)",
                    padding: "var(--space-sm)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <ShieldCheck size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <span>Secure 256-bit encrypted checkout gateway.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ── Sandbox Payment Simulator Modal Overlay ── */}
      {showSandbox && sandboxData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "var(--z-modal)",
            padding: "var(--space-md)",
          }}
        >
          <div
            className="glass-strong animate-scale-in"
            style={{
              width: "100%",
              maxWidth: "480px",
              padding: "var(--space-2xl)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-medium)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-md)" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "rgba(244, 162, 97, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gold)",
                }}
              >
                <AlertTriangle size={24} />
              </div>
            </div>

            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "800", textAlign: "center", marginBottom: "var(--space-sm)" }}>
              Razorpay Sandbox Simulator
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", textAlign: "center", marginBottom: "var(--space-lg)" }}>
              No real Razorpay API keys were found in the server environment. You are currently in development checkout simulation.
            </p>

            <div
              className="glass"
              style={{
                padding: "var(--space-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                fontSize: "var(--text-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-xs)",
                marginBottom: "var(--space-xl)",
              }}
            >
              <div className="flex-between">
                <span style={{ color: "var(--text-secondary)" }}>Mock Order ID</span>
                <span style={{ fontWeight: "600", fontFamily: "monospace" }}>{sandboxData.razorpayOrderId}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: "var(--text-secondary)" }}>Total Amount</span>
                <span style={{ fontWeight: "700", color: "var(--primary)" }}>₹{sandboxData.amount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-md)" }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => {
                  setShowSandbox(false);
                  setSandboxData(null);
                }}
                disabled={isVerifying}
              >
                Cancel Checkout
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center", gap: "var(--space-xs)" }}
                onClick={handleSimulateSuccess}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Simulate Success</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
