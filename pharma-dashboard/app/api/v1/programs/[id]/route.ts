import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import * as mockData from "@/lib/data/programs";
import * as dbData from "@/lib/data/programs-db";

const { getProgramById, updateProgram, deleteProgram } = env.useMockData ? mockData : dbData;

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/v1/programs/[id] - Get a specific program by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const program = await getProgramById(id);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ data: program });
  } catch (error) {
    console.error("Failed to fetch program:", error);
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}

// PUT /api/v1/programs/[id] - Update a specific program
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const { name, therapeuticArea, phase, status, manager } = body;
    if (!name || !therapeuticArea || !phase || !status || !manager) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedProgram = await updateProgram(id, {
      name: body.name,
      description: body.description,
      therapeuticArea: body.therapeuticArea,
      phase: body.phase,
      status: body.status,
      manager: body.manager,
      budget: body.budget,
      progress: body.progress,
      riskLevel: body.riskLevel,
    });

    if (!updatedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updatedProgram });
  } catch (error) {
    console.error("Failed to update program:", error);
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

// DELETE /api/v1/programs/[id] - Delete a specific program
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const deleted = await deleteProgram(id);

    if (!deleted) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ data: null, message: "Program deleted successfully" });
  } catch (error) {
    console.error("Failed to delete program:", error);
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
