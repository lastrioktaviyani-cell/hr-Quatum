import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { z } from "zod";

const updateIndicatorSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["HIGHER_BETTER", "LOWER_BETTER", "PERCENTAGE", "BOOLEAN", "MANUAL_SCORE"]).optional(),
  unit: z.string().min(1).optional(),
  weight: z.number().min(0).max(100).optional(),
  penalty: z.number().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateIndicatorSchema.parse(body);

    const indicator = await getDb().kpiIndicator.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: indicator });
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await getDb().kpiIndicator.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Cannot delete indicator." },
      { status: 400 }
    );
  }
}
