import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { z } from "zod";

const createCategorySchema = z.object({
  templateId: z.string().uuid("Invalid template ID"),
  name: z.string().min(1, "Name is required"),
  weight: z.number().min(0).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createCategorySchema.parse(body);

    const category = await getDb().kpiCategory.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
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
