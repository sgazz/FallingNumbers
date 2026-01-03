import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drop Numbers - Math Tetris",
  description: "A 3D math puzzle game similar to Tetris",
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

