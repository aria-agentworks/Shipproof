import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShipProof - Video Proof of Order Packing",
  description: "Record your order being packed, send a tamper-proof video to your buyer. Build trust, reduce disputes, grow your business. Starting at $29/mo.",
  keywords: ["shipproof", "order verification", "video proof", "packing video", "Etsy seller tool", "dropship protection"],
  openGraph: {
    title: "ShipProof - Video Proof Your Orders Were Packed",
    description: "Record, store, and send tamper-proof packing videos to buyers.",
    siteName: "ShipProof",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
