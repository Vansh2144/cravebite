import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "CraveBite — Cravings Delivered Fast",
  description:
    "Order delicious food from top restaurants near you. Premium food delivery with real-time tracking, diverse cuisines, and lightning-fast delivery.",
  keywords: [
    "food delivery",
    "order food online",
    "restaurant delivery",
    "CraveBite",
    "fast food delivery",
  ],
  authors: [{ name: "CraveBite" }],
  openGraph: {
    title: "CraveBite — Cravings Delivered Fast",
    description:
      "Order delicious food from top restaurants near you. Premium food delivery with real-time tracking.",
    type: "website",
    locale: "en_US",
    siteName: "CraveBite",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0A0A0F" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
