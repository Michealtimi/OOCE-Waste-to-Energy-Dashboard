"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useWasteData } from "@/context/waste-data-context"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface SubmissionsTableProps {
  lgaFilter?: string
  limit?: number
  showLgaLink?: boolean
}

export function SubmissionsTable({ lgaFilter, limit = 10, showLgaLink = true }: SubmissionsTableProps) {
  const { submissions } = useWasteData()

  const filtered = lgaFilter ? submissions.filter((s) => s.lga === lgaFilter) : submissions

  const displayedSubmissions = filtered.slice(0, limit)

  const getWasteTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Organic":
        return "default"
      case "Plastic":
        return "secondary"
      case "Mixed":
        return "outline"
      case "Inert":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg text-primary">
          {lgaFilter ? `${lgaFilter} Submissions` : "Latest Submissions"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                {!lgaFilter && <TableHead className="text-muted-foreground font-medium">LGA</TableHead>}
                <TableHead className="text-muted-foreground font-medium">PSP Operator</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Tons</TableHead>
                <TableHead className="text-muted-foreground font-medium">Waste Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedSubmissions.map((submission) => (
                <TableRow key={submission.id} className="border-border">
                  <TableCell className="font-medium">
                    {new Date(submission.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  {!lgaFilter && (
                    <TableCell>
                      {showLgaLink ? (
                        <Link
                          href={`/lga/${encodeURIComponent(submission.lga)}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {submission.lga}
                        </Link>
                      ) : (
                        submission.lga
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-muted-foreground">{submission.pspOperator}</TableCell>
                  <TableCell className="text-right font-semibold text-accent">{submission.tons.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge variant={getWasteTypeBadgeVariant(submission.wasteType)}>{submission.wasteType}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {displayedSubmissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={lgaFilter ? 4 : 5} className="text-center text-muted-foreground py-8">
                    No submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
