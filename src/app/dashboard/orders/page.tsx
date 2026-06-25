import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import OrdersClient from "@/components/OrdersClient";
import RestaurantOrdersClient from "@/components/RestaurantOrdersClient";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch full user details from DB
  const user = await db.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    redirect("/login");
  }

  // ── RESTAURANT ORDERS ──
  if (user.role === "RESTAURANT") {
    const restaurant = await db.restaurant.findUnique({
      where: { userId: user.id },
    });

    if (!restaurant) {
      redirect("/dashboard/restaurant-profile");
    }

    const orders = await db.order.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                name: true,
                isVeg: true,
              },
            },
          },
        },
      },
    });

    return (
      <RestaurantOrdersClient
        initialOrders={orders.map((order) => ({
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          deliveryAddress: order.deliveryAddress,
          createdAt: order.createdAt.toISOString(),
          customer: {
            name: order.user.name || "Customer",
            email: order.user.email,
            phone: order.user.phone || "Not provided",
          },
          orderItems: order.orderItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            menuItem: {
              name: item.menuItem.name,
              isVeg: item.menuItem.isVeg,
            },
          })),
        }))}
      />
    );
  }

  // ── CUSTOMER ORDERS ──
  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
      orderItems: {
        include: {
          menuItem: {
            select: {
              name: true,
              isVeg: true,
            },
          },
        },
      },
    },
  });

  return (
    <OrdersClient
      initialOrders={orders.map((order) => ({
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt.toISOString(),
        restaurant: {
          name: order.restaurant.name,
        },
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          menuItem: {
            name: item.menuItem.name,
            isVeg: item.menuItem.isVeg,
          },
        })),
      }))}
    />
  );
}
