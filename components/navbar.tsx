"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, PlusCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/submit", label: "Submit Data", icon: PlusCircle },
  ]

  return (
    <nav className="bg-primary text-primary-foreground border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/occe-logo.svg" alt="OCCE Logo" width={40} height={40} className="h-10 w-auto" />
              <div className="hidden sm:block">
                <p className="font-serif font-bold text-sm leading-tight">Office of Climate Change</p>
                <p className="text-xs text-primary-foreground/70">& Circular Economy (OCCE)</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}

            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
