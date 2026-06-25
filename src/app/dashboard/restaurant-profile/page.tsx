import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import RestaurantProfileClient from "./RestaurantProfileClient";

export default async function RestaurantProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user || user.role !== "RESTAURANT") {
    redirect("/dashboard");
  }

  let restaurant = await db.restaurant.findUnique({
    where: { userId: user.id },
  });

  if (!restaurant) {
    // If somehow a restaurant doesn't exist, initialize a default stub
    let slug = (user.name || "my-restaurant")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    restaurant = await db.restaurant.create({
      data: {
        name: user.name || "My Restaurant",
        slug: `${slug}-${user.id.slice(-4)}`,
        address: user.defaultAddress || "Restaurant Address",
        cuisine: "Indian",
        userId: user.id,
      },
    });
  }

  return (
    <RestaurantProfileClient
      restaurant={{
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        deliveryTime: restaurant.deliveryTime,
      }}
    />
  );
}
