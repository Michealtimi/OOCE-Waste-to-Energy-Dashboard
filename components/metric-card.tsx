import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  variant?: "default" | "accent"
}

export function MetricCard({ title, value, subtitle, icon: Icon, variant = "default" }: MetricCardProps) {
  return (
    <Card
      className={cn(
        "border shadow-sm",
        variant === "accent" ? "bg-occe-light-green border-accent/30" : "bg-card border-border",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold font-serif", variant === "accent" ? "text-accent" : "text-primary")}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn("p-2 rounded", variant === "accent" ? "bg-accent/20" : "bg-primary/10")}>
            <Icon className={cn("w-5 h-5", variant === "accent" ? "text-accent" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
