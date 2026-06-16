import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  weight: z.number().min(0).max(100).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateCategorySchema.parse(body);

    const category = await getDb().kpiCategory.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: category });
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
    await getDb().kpiCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Cannot delete category." },
      { status: 400 }
    );
  }
}
