import { Cinzel_Decorative, Inter } from "next/font/google";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./components/Providers";

const titleFont = Cinzel_Decorative({ variable: "--font-title", subsets: ["latin"], weight: ["400","700"], display: "swap" });
const bodyFont = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Tormenta 20 - Ficha",
  description: "Ficha de personagem Tormenta 20",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${titleFont.variable} ${bodyFont.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

