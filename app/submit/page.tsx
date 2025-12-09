import { Navbar } from "@/components/navbar"
import { SubmitForm } from "@/components/submit-form"

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary">Submit Waste Data</h1>
          <p className="text-muted-foreground mt-1">
            Record daily waste collection from PSP operators across Lagos LGAs
          </p>
        </div>

        <SubmitForm />
      </main>
    </div>
  )
}
