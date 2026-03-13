import { type Alert } from "@/types";

/**
 * In-memory alerts store using globalThis for shared state across route handlers.
 * Next.js bundles each route separately, so normal module-level variables
 * are NOT shared between /api/alerts and /api/alerts/[id].
 * globalThis persists across the same Node.js process.
 *
 * In production, replace with database queries.
 */

const ALERTS_KEY = "__pharma_alerts_store__";
const ALERTS_NEXT_ID_KEY = "__pharma_alerts_next_id__";

function getInitialAlerts(): Alert[] {
  return [
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
      notifyBefore: [7, 3, 1],
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
      notifyBefore: [7, 3],
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
      notifyBefore: [14, 7, 3],
    },
  ];
}

// Use globalThis to share state across separately-bundled route handlers
const g = globalThis as typeof globalThis & {
  [ALERTS_KEY]?: Alert[];
  [ALERTS_NEXT_ID_KEY]?: number;
};

if (!g[ALERTS_KEY]) {
  g[ALERTS_KEY] = getInitialAlerts();
}
if (!g[ALERTS_NEXT_ID_KEY]) {
  g[ALERTS_NEXT_ID_KEY] = 4;
}

export const alerts: Alert[] = g[ALERTS_KEY]!;

export function getNextAlertId(): string {
  const id = g[ALERTS_NEXT_ID_KEY]!;
  g[ALERTS_NEXT_ID_KEY] = id + 1;
  return `A${String(id).padStart(3, "0")}`;
}
