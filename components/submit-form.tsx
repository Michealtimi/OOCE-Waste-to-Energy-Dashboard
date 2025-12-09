"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWasteData, LGAS, PSP_OPERATORS, WASTE_TYPES } from "@/context/waste-data-context"
import { toast } from "sonner"
import { Calculator, Zap, Leaf } from "lucide-react"

export function SubmitForm() {
  const { addSubmission } = useWasteData()
  const [formData, setFormData] = useState({
    pspOperator: "",
    lga: "",
    wasteType: "",
    tons: "",
    date: new Date().toISOString().split("T")[0],
  })

  const tons = Number.parseFloat(formData.tons) || 0
  const estimatedEnergy = tons * 650
  const estimatedCredits = tons * 0.42

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.pspOperator || !formData.lga || !formData.wasteType || !formData.tons || !formData.date) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      await addSubmission({
        pspOperator: formData.pspOperator,
        lga: formData.lga,
        wasteType: formData.wasteType,
        tons: Number.parseFloat(formData.tons),
        date: formData.date,
      })

      toast.success("Waste data submitted successfully!", {
        description: `${formData.tons} tons recorded for ${formData.lga}`,
      })

      setFormData({
        pspOperator: "",
        lga: "",
        wasteType: "",
        tons: "",
        date: new Date().toISOString().split("T")[0],
      })
    } catch (error) {
      console.error("Submission failed:", error)
      toast.error("Submission failed.", {
        description: "Could not save the data. Please try again.",
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-primary">Submit Waste Collection Data</CardTitle>
          <CardDescription>Record daily waste collection for energy conversion tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pspOperator" className="text-sm font-medium">
                PSP Operator
              </Label>
              <Select
                value={formData.pspOperator}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, pspOperator: value }))}
              >
                <SelectTrigger id="pspOperator">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {PSP_OPERATORS.map((operator) => (
                    <SelectItem key={operator} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lga" className="text-sm font-medium">
                Local Government Area (LGA)
              </Label>
              <Select value={formData.lga} onValueChange={(value) => setFormData((prev) => ({ ...prev, lga: value }))}>
                <SelectTrigger id="lga">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  {LGAS.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wasteType" className="text-sm font-medium">
                Waste Type
              </Label>
              <Select
                value={formData.wasteType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, wasteType: value }))}
              >
                <SelectTrigger id="wasteType">
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  {WASTE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tons" className="text-sm font-medium">
                Tonnage
              </Label>
              <Input
                id="tons"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter tonnage"
                value={formData.tons}
                onChange={(e) => setFormData((prev) => ({ ...prev, tons: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Collection Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Submit Collection Data
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-lagos-light-green">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-primary flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Estimated Conversion
          </CardTitle>
          <CardDescription>Real-time calculation based on tonnage input</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-card rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Zap className="w-4 h-4 text-accent" />
              Energy Generated
            </div>
            <p className="text-3xl font-bold font-serif text-accent">
              {estimatedEnergy.toLocaleString()} <span className="text-lg font-normal">kWh</span>
            </p>
            <p className="text-xs text-muted-foreground">Based on 650 kWh per ton</p>
          </div>

          <div className="p-4 bg-card rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Leaf className="w-4 h-4 text-accent" />
              Carbon Credits Earned
            </div>
            <p className="text-3xl font-bold font-serif text-accent">
              {estimatedCredits.toFixed(2)} <span className="text-lg font-normal">credits</span>
            </p>
            <p className="text-xs text-muted-foreground">Based on 0.42 credits per ton</p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Formula:</strong>
              <br />
              Energy (kWh) = Tons × 650
              <br />
              Carbon Credits = Tons × 0.42
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
