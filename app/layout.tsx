import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Encousce",
  description: "Step into a scene. Start an encounter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
