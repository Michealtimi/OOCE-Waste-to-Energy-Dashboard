import { NextResponse } from "next/server";
import { z } from "zod";

// This will act as our in-memory "database" for this example.
const submissions: any[] = [];

const submissionSchema = z.object({
  lga: z.string().min(1, "LGA is required."),
  tons: z.number().positive("Tonnage must be a positive number."),
  date: z.string().min(1, "Date is required."),
  pspOperator: z.string(),
  wasteType: z.string(),
});

export async function POST (request: Request) {
  try {
    const body = await request.json();
    const newSubmission = submissionSchema.parse(body);
    const data = { ...newSubmission, id: `sub-${Date.now()}`, energyKWh: newSubmission.tons * 650, carbonCredits: newSubmission.tons * 0.42 };
    submissions.push(data);
    return NextResponse.json({ message: "Submission successful!", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid data submitted.", error }, { status: 400 });
  }
}

export async function GET () {
    return NextResponse.json({ submissions });
}