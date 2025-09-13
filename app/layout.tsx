import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Automation Solutions for Small Business | ShipsMind",
  description: "Save 10+ hours per week and increase revenue through smart AI automation. Specialized solutions for retail, legal, accounting, and skilled trades.",
  keywords: "AI automation, small business, SMB, process automation, workflow optimization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <Header />
        {children}
      </body>
    </html>
  );
}