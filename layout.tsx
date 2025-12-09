import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WasteDataProvider } from "@/context/waste-data-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Waste to Energy Dashboard",
  description: "Analytics for waste collection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WasteDataProvider>{children}</WasteDataProvider>
      </body>
    </html>
  );
}