import type { Metadata } from "next";
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";

import "./globals.css";

const display = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "VAREL | Modern Grooming",
    template: "%s — VAREL",
  },

  description:
    "VAREL is a modern grooming lounge where classic barbering meets considered design, craft, and ritual.",

  keywords: [
    "VAREL",
    "barber",
    "barbershop",
    "grooming lounge",
    "men's grooming",
    "haircut",
    "shave",
  ],

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),

  openGraph: {
    title: "VAREL | Modern Grooming",
    description:
      "Classic craft. Modern ritual. Experience VAREL.",
    type: "website",
    siteName: "VAREL",
  },

  twitter: {
    card: "summary_large_image",
    title: "VAREL | Modern Grooming",
    description:
      "Classic craft. Modern ritual. Experience VAREL.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}