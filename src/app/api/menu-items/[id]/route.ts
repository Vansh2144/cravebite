import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const menuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
  category: z.string().min(2, "Category must be at least 2 characters"),
  isVeg: z.boolean().default(true),
  available: z.boolean().default(true),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const menuItem = await db.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem || menuItem.restaurantId !== restaurant.id) {
      return NextResponse.json(
        { message: "Menu item not found or does not belong to this restaurant" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validation = menuItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const updatedItem = await db.menuItem.update({
      where: { id },
      data: {
        name: validation.data.name,
        description: validation.data.description || null,
        price: validation.data.price,
        category: validation.data.category,
        isVeg: validation.data.isVeg,
        available: validation.data.available,
      },
    });

    return NextResponse.json({
      message: "Menu item updated successfully",
      menuItem: updatedItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const menuItem = await db.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem || menuItem.restaurantId !== restaurant.id) {
      return NextResponse.json(
        { message: "Menu item not found or does not belong to this restaurant" },
        { status: 404 }
      );
    }

    await db.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
