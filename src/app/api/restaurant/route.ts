import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  cuisine: z.string().min(2, "Cuisine must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  deliveryTime: z.preprocess((val) => Number(val), z.number().min(5).max(180)),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.role !== "RESTAURANT") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const restaurant = await db.restaurant.findUnique({
      where: { userId: user.id },
    });

    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    const body = await req.json();
    const validation = restaurantSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const updatedRestaurant = await db.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name: validation.data.name,
        cuisine: validation.data.cuisine,
        address: validation.data.address,
        deliveryTime: validation.data.deliveryTime,
      },
    });

    return NextResponse.json({
      message: "Restaurant profile updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
