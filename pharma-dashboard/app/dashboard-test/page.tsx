"use client";

import { DashboardTestFix } from "@/components/organisms/dashboard/dashboard-test-fix";
import { PageHeader } from "@/components/organisms/page-header";
import { TestTube } from "lucide-react";

export default function DashboardTestPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Fixes Test"
        description="Verify that enrollment calculation and button alignment fixes are working correctly"
        icon={TestTube}
      />
      <DashboardTestFix />
    </div>
  );
}