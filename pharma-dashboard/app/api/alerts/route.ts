import { NextRequest, NextResponse } from "next/server";
import { type Alert, type NotificationChannel } from "@/types";

// In-memory storage for demo purposes
// In a real application, you would use a database
export const alerts: Alert[] = [
  {
    id: "A001",
    programId: "PROG001",
    studyId: "STD001",
    program: "Alzheimer's Treatment Program",
    study: "ALZ-001",
    deadline: new Date("2026-04-15"),
    channel: ["Email", "SMS"],
    status: "Active",
    recurring: "One-time",
    notifyBefore: [7, 3, 1]
  },
  {
    id: "A002",
    programId: "PROG002",
    program: "CAR-T Cell Therapy",
    study: "All studies",
    deadline: new Date("2026-03-30"),
    channel: ["Push"],
    status: "Overdue",
    recurring: "Weekly",
    notifyBefore: [7, 3]
  },
  {
    id: "A003",
    programId: "PROG003",
    studyId: "STD004",
    program: "Diabetes Prevention Study",
    study: "DIA-001",
    deadline: new Date("2026-05-20"),
    channel: ["Email"],
    status: "Active",
    recurring: "One-time",
    notifyBefore: [14, 7, 3]
  }
];

let nextId = 4;

// GET /api/alerts - Get all alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get("programId");
    const status = searchParams.get("status");

    let filteredAlerts = alerts;

    // Apply program filter
    if (programId) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.programId === programId);
    }

    // Apply status filter
    if (status && status !== "All") {
      filteredAlerts = filteredAlerts.filter((alert) => alert.status === status);
    }

    return NextResponse.json(filteredAlerts);
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

// POST /api/alerts - Create a new alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { programId, program, study, deadline, channel, recurring, notifyBefore } = body;
    if (!programId || !program || !study || !deadline || !channel || !recurring || !notifyBefore) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate new alert ID
    const newId = `A${String(nextId++).padStart(3, "0")}`;

    // Create new alert
    const newAlert: Alert = {
      id: newId,
      programId: body.programId,
      studyId: body.studyId || undefined,
      program: body.program,
      study: body.study,
      deadline: new Date(body.deadline),
      channel: body.channel as NotificationChannel[],
      status: "Active",
      recurring: body.recurring,
      notifyBefore: body.notifyBefore,
    };

    // Add to alerts array
    alerts.push(newAlert);

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error("Failed to create alert:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
