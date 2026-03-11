import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BodyContent from "@/components/BodyContent"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"

const poppins = localFont({
  src: [
    { path: "../public/fonts/poppins-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/poppins-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/poppins-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ments - Where Hustle Begins",
  description: "Join the community where your entrepreneurial journey starts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className} suppressHydrationWarning>
        <AuthProvider>
          <BodyContent>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </BodyContent>
        </AuthProvider>
      </body>
    </html>
  )
}
