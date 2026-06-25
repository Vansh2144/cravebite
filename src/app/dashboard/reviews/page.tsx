import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Star, MessageSquare } from "lucide-react";

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch reviews matching this user
  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: {
      reviews: {
        include: { restaurant: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex-col" style={{ gap: "var(--space-md)", width: "100%" }}>
      <div style={{ marginBottom: "var(--space-xs)" }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "700" }}>My Reviews</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          Manage and review feedback you have left for local kitchens.
        </p>
      </div>

      {user.reviews.length === 0 ? (
        <div
          className="glass"
          style={{
            padding: "var(--space-4xl) var(--space-xl)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Star size={48} color="var(--text-tertiary)" style={{ marginBottom: "var(--space-md)" }} />
          <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "600" }}>No reviews left yet</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Review options will unlock here once your first order is delivered!
          </p>
        </div>
      ) : (
        <div className="flex-col" style={{ gap: "var(--space-md)" }}>
          {user.reviews.map((review) => (
            <div
              key={review.id}
              className="glass-card"
              style={{
                padding: "var(--space-lg)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
              }}
            >
              <div className="flex-between">
                <strong style={{ fontSize: "var(--text-base)" }}>{review.restaurant.name}</strong>
                <div style={{ display: "flex", gap: "2px", color: "var(--gold)" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < review.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                    />
                  ))}
                </div>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: "1.4" }}>
                {review.comment || "No written review comments."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
