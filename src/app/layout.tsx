import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./style.css";
import { NextFont } from "next/dist/compiled/@next/font";

const inter: NextFont = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Sudoku solver",
  description: "Sudoku solving app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="sudoku-container">{children}</main>
      </body>
    </html>
  );
}
