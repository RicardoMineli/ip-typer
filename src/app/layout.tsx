import type { Metadata } from "next";
import { ubuntu } from "@/app/ui/fonts";
import "@/app/ui/global.css";

export const metadata: Metadata = {
  title: "IP Typer",
  description: "Test your IPv4 typing skills and train to improve",
  keywords: "ip, ipv4, speed typing, typing test, internet protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ubuntu.className} antialiased `}>{children}</body>
    </html>
  );
}
