import { NextRequest, NextResponse } from "next/server";
import { type Alert, type NotificationChannel } from "@/types";
import { alerts, getNextAlertId } from "@/lib/data/alerts-store";

// GET /api/v1/alerts - Get all alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get("programId");
    const status = searchParams.get("status");

    let filteredAlerts = alerts;

    if (programId) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.programId === programId);
    }

    if (status && status !== "All") {
      filteredAlerts = filteredAlerts.filter((alert) => alert.status === status);
    }

    return NextResponse.json({ data: filteredAlerts, totalCount: alerts.length });
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

// POST /api/v1/alerts - Create a new alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { programId, program, study, deadline, channel, recurring, notifyBefore } = body;
    if (!programId || !program || !study || !deadline || !channel || !recurring || !notifyBefore) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newAlert: Alert = {
      id: getNextAlertId(),
      programId: body.programId,
      studyId: body.studyId || undefined,
      program: body.program,
      study: body.study,
      message: body.message || "New alert created",
      deadline: new Date(body.deadline),
      channel: body.channel as NotificationChannel[],
      status: "Active",
      priority: body.priority || "Medium",
      type: body.type || "Milestone",
      recurring: body.recurring,
      notifyBefore: body.notifyBefore,
      createdAt: new Date(),
    };

    alerts.push(newAlert);

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error("Failed to create alert:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
