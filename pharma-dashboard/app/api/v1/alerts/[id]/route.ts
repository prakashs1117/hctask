import { NextRequest, NextResponse } from "next/server";
import { alerts } from "@/lib/data/alerts-store";

// GET /api/v1/alerts/:id - Get alert by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alert = alerts.find((a) => a.id === id);

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Failed to fetch alert:", error);
    return NextResponse.json({ error: "Failed to fetch alert" }, { status: 500 });
  }
}

// PUT /api/v1/alerts/:id - Update an alert
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = alerts.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    const body = await request.json();

    const updatedAlert = {
      ...alerts[index],
      ...body,
      id, // Prevent ID override
      deadline: body.deadline ? new Date(body.deadline) : alerts[index].deadline,
    };

    alerts[index] = updatedAlert;

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error("Failed to update alert:", error);
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
  }
}

// DELETE /api/v1/alerts/:id - Delete an alert
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = alerts.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    alerts.splice(index, 1);

    return NextResponse.json({ message: "Alert deleted successfully" });
  } catch (error) {
    console.error("Failed to delete alert:", error);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
