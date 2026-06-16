import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { z } from "zod";

const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const templates = await getDb().kpiTemplate.findMany({
      include: {
        _count: {
          select: { categories: true, assignments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: templates });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createTemplateSchema.parse(body);

    const template = await getDb().kpiTemplate.create({
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
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
