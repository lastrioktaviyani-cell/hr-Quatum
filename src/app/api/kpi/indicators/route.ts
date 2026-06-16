import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { z } from "zod";

const createIndicatorSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["HIGHER_BETTER", "LOWER_BETTER", "PERCENTAGE", "BOOLEAN", "MANUAL_SCORE"]),
  unit: z.string().min(1, "Unit is required"),
  weight: z.number().min(0).max(100),
  penalty: z.number().default(0),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createIndicatorSchema.parse(body);

    const indicator = await getDb().kpiIndicator.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: indicator }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
