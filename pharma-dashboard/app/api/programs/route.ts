import { NextRequest, NextResponse } from "next/server";
import { type Program, type TherapeuticArea, type Phase, type ProgramStatus } from "@/types";
import { getAllPrograms, createProgram } from "@/lib/data/programs";

// GET /api/programs - Get all programs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const phase = searchParams.get("phase") || "All";
    const therapeuticArea = searchParams.get("therapeuticArea") || "All";
    const status = searchParams.get("status") || "All";

    let filteredPrograms = getAllPrograms();

    // Apply search filter
    if (search) {
      filteredPrograms = filteredPrograms.filter(
        (program) =>
          program.name.toLowerCase().includes(search) ||
          program.description?.toLowerCase().includes(search) ||
          program.manager.toLowerCase().includes(search)
      );
    }

    // Apply phase filter
    if (phase !== "All") {
      filteredPrograms = filteredPrograms.filter((program) => program.phase === phase);
    }

    // Apply therapeutic area filter
    if (therapeuticArea !== "All") {
      filteredPrograms = filteredPrograms.filter(
        (program) => program.therapeuticArea === therapeuticArea
      );
    }

    // Apply status filter
    if (status !== "All") {
      filteredPrograms = filteredPrograms.filter((program) => program.status === status);
    }

    return NextResponse.json(filteredPrograms);
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

// POST /api/programs - Create a new program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, therapeuticArea, phase, status, manager } = body;
    if (!name || !therapeuticArea || !phase || !status || !manager) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate new program ID
    const programs = getAllPrograms();
    const newId = `PROG${String(programs.length + 1).padStart(3, "0")}`;

    // Create new program
    const newProgram: Program = {
      id: newId,
      name: body.name,
      description: body.description || "",
      therapeuticArea: body.therapeuticArea as TherapeuticArea,
      phase: body.phase as Phase,
      status: body.status as ProgramStatus,
      manager: body.manager,
      createdAt: new Date(),
      updatedAt: new Date(),
      studies: [],
      milestones: [],
    };

    // Add to programs array
    const createdProgram = createProgram(newProgram);

    return NextResponse.json(createdProgram, { status: 201 });
  } catch (error) {
    console.error("Failed to create program:", error);
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
