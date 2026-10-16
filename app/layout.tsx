import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sawt Atlas",
  description: "Darija-inspired voiceover studio in demo and production-ready modes",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body>{children}</body>
    </html>
  );
}
