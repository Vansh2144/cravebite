import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { razorpayInstance, IS_MOCK_PAYMENT } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, restaurantId, deliveryAddress } = await req.json();

    if (!cartItems || cartItems.length === 0 || !restaurantId || !deliveryAddress) {
      return NextResponse.json({ message: "Invalid payload details" }, { status: 400 });
    }

    // Verify item prices from DB for security
    let subtotal = 0;
    const itemsToCreate = [];

    for (const item of cartItems) {
      const dbItem = await db.menuItem.findUnique({
        where: { id: item.id },
      });

      if (!dbItem || dbItem.restaurantId !== restaurantId) {
        return NextResponse.json({ message: `Item ${item.name} not found or invalid` }, { status: 400 });
      }

      subtotal += dbItem.price * item.quantity;
      itemsToCreate.push({
        menuItemId: item.id,
        quantity: item.quantity,
        price: dbItem.price,
      });
    }

    // Taxes & Fees
    const deliveryFee = 40;
    const gstTax = subtotal * 0.05; // 5% GST
    const totalAmount = subtotal + deliveryFee + gstTax;

    let razorpayOrderId = null;
    let orderId = "";

    // ── Payment Mode: Real or Mock Sandbox ──
    if (IS_MOCK_PAYMENT) {
      // Mock Sandbox Mode
      orderId = "order_mock_" + Math.random().toString(36).substring(2, 15);
      razorpayOrderId = orderId;
    } else {
      // Real Razorpay Mode
      try {
        const rzpOrder = await razorpayInstance!.orders.create({
          amount: Math.round(totalAmount * 100), // in paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        });
        razorpayOrderId = rzpOrder.id;
      } catch (err: any) {
        console.error("Razorpay order creation error:", err);
        return NextResponse.json({ message: "Razorpay setup failed" }, { status: 500 });
      }
    }

    // Create order record in Database as PENDING
    const userEmail = session.user.email!;
    const user = await db.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newDbOrder = await db.order.create({
      data: {
        userId: user.id,
        restaurantId,
        totalAmount,
        status: "PENDING",
        deliveryAddress,
        paymentStatus: "UNPAID",
        razorpayOrderId,
        orderItems: {
          create: itemsToCreate,
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: newDbOrder.id,
      razorpayOrderId,
      amount: totalAmount,
      currency: "INR",
      isMock: IS_MOCK_PAYMENT,
    });
  } catch (error: any) {
    console.error("Create order API error:", error);
    return NextResponse.json({ message: "Error placing order" }, { status: 500 });
  }
}
