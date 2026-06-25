import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import MenuClient from "./MenuClient";

export default async function MenuPage() {
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

  const restaurant = await db.restaurant.findUnique({
    where: { userId: user.id },
    include: {
      menuItems: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!restaurant) {
    redirect("/dashboard/restaurant-profile");
  }

  return (
    <MenuClient
      initialMenuItems={restaurant.menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        isVeg: item.isVeg,
        available: item.available,
      }))}
    />
  );
}
