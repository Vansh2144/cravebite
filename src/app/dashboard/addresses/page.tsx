import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { MapPin, Home, Briefcase, Plus } from "lucide-react";

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    select: { defaultAddress: true },
  });

  return (
    <div className="flex-col" style={{ gap: "var(--space-md)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-xs)" }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "700" }}>Manage Addresses</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          Manage your saved delivery locations for faster checkouts.
        </p>
      </div>

      <div className="grid-responsive" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-md)" }}>
        {/* Default Address Card */}
        {user?.defaultAddress ? (
          <div className="glass-card" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-md)", alignItems: "start" }}>
            <div style={{ padding: "8px", background: "var(--primary-glow)", borderRadius: "50%", color: "var(--primary)", flexShrink: 0 }}>
              <Home size={18} />
            </div>
            <div className="flex-col" style={{ gap: "4px" }}>
              <span className="badge badge-primary" style={{ width: "fit-content", fontSize: "10px", padding: "1px 6px" }}>
                DEFAULT
              </span>
              <strong style={{ fontSize: "var(--text-base)" }}>Home Address</strong>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: "1.4" }}>
                {user.defaultAddress}
              </p>
            </div>
          </div>
        ) : (
          <div className="glass" style={{ padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>No address saved.</p>
          </div>
        )}

        {/* Add Address Card */}
        <button
          className="glass flex-center flex-col"
          style={{
            minHeight: "150px",
            borderRadius: "var(--radius-lg)",
            border: "1.5px dashed var(--border-medium)",
            cursor: "pointer",
            gap: "var(--space-sm)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          <Plus size={24} />
          <span style={{ fontWeight: "600", fontSize: "var(--text-sm)" }}>Add New Address</span>
        </button>
      </div>
    </div>
  );
}
