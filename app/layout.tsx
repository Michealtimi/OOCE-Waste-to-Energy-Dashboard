import type React from "react"
import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { WasteDataProvider } from "@/context/waste-data-context"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Lagos Waste-to-Energy Dashboard | OCCE",
  description: "Lagos State Office of Climate Change & Circular Economy - Waste-to-Energy Tracking System",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <WasteDataProvider>{children}</WasteDataProvider>
        <Analytics />
      </body>
    </html>
  )
}
