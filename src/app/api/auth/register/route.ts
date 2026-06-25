import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  defaultAddress: z.string().min(5, "Address must be at least 5 characters"),
  role: z.string().default("CUSTOMER"),
  restaurantName: z.string().optional(),
  cuisine: z.string().optional(),
  deliveryTime: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate inputs
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone, defaultAddress, role, restaurantName, cuisine, deliveryTime } = validation.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and restaurant in a transaction
    const newUser = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          phone,
          defaultAddress,
          role,
        },
      });

      if (role === "RESTAURANT") {
        if (!restaurantName || !cuisine) {
          throw new Error("Restaurant name and cuisine are required");
        }

        // Generate slug
        let slug = restaurantName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        // Ensure unique slug
        const existingRest = await tx.restaurant.findUnique({
          where: { slug },
        });

        if (existingRest) {
          slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }

        await tx.restaurant.create({
          data: {
            name: restaurantName,
            slug,
            address: defaultAddress,
            cuisine,
            deliveryTime: deliveryTime || 30,
            userId: user.id,
          },
        });
      }

      return user;
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}
