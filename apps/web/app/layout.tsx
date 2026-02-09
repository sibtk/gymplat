import { Agentation } from "agentation";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Fragment_Mono, Inter } from "next/font/google";

import "./globals.css";

import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-fragment-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "GymPlatform — Modern Gym Management",
  description:
    "Full-stack gym management and payment processing platform for 24-hour gyms, PT studios, and functional fitness facilities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${fragmentMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
