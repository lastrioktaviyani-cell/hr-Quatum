import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { z } from "zod";

const updateTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await getDb().kpiTemplate.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            indicators: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: template });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateTemplateSchema.parse(body);

    const template = await getDb().kpiTemplate.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: template });
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
    await getDb().kpiTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Cannot delete template. It may be in use." },
      { status: 400 }
    );
  }
}
