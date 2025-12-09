"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login delay then redirect
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* OCCE Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/images/occe-logo.svg" alt="OCCE Logo" width={80} height={80} className="h-20 w-auto" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-primary">Office of Climate Change</h1>
          <p className="text-muted-foreground text-sm">& Circular Economy (OCCE)</p>
        </div>

        {/* Login Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif text-xl text-primary">Waste-to-Energy Portal</CardTitle>
            <CardDescription>Sign in to access the tracking dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@lagosstate.gov.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-card"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Lagos State Government &bull; Climate Action Initiative
        </p>
      </div>
    </div>
  )
}
