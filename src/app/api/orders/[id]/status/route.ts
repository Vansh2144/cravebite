import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["PENDING", "PREPARING", "SENT", "DELIVERED", "CANCELLED"]),
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

    const order = await db.order.findUnique({
      where: { id },
    });

    if (!order || order.restaurantId !== restaurant.id) {
      return NextResponse.json(
        { message: "Order not found or does not belong to this restaurant" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validation = statusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status: validation.data.status,
      },
    });

    return NextResponse.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
