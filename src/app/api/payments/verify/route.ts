import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ message: "Missing verification parameters" }, { status: 400 });
    }

    // Find the corresponding order
    const order = await db.order.findFirst({
      where: { razorpayOrderId },
    });

    if (!order) {
      return NextResponse.json({ message: "Order records not found" }, { status: 404 });
    }

    let isValid = false;

    // ── Signature Verification ──
    if (razorpayOrderId.startsWith("order_mock_")) {
      // Mock Sandbox Verification
      isValid = razorpaySignature === "mock_signature";
    } else {
      // Real Razorpay Verification
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return NextResponse.json({ message: "Server payment configuration missing" }, { status: 500 });
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      isValid = generatedSignature === razorpaySignature;
    }

    if (!isValid) {
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    // Update order status on success
    await db.order.update({
      where: { id: order.id },
      data: {
        status: "PREPARING", // Preparing food status
        paymentStatus: "PAID",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order placed and payment verified successfully!",
    });
  } catch (error: any) {
    console.error("Payment verify API error:", error);
    return NextResponse.json({ message: "Payment verification failed internally" }, { status: 500 });
  }
}
