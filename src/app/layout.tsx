import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanxcel AI Technologies - Enterprise AI & Software Solutions",
  description:
    "Hanxcel AI Technologies Pvt. Ltd. builds enterprise-grade AI, software, IoT, and cloud solutions that accelerate digital transformation.",
  keywords:
    "AI, Machine Learning, Software Development, IoT, Cloud Solutions, Enterprise Software, Hanxcel AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
