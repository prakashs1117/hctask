"use client";

import { ProgramCRUDDemo } from "@/components/organisms/programs/program-crud-demo";
import { PageHeader } from "@/components/organisms/page-header";
import { TestTube } from "lucide-react";

export default function ProgramsDemoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Program CRUD Operations Demo"
        description="Test all Create, Read, Update, and Delete operations for programs"
        icon={TestTube}
      />
      <ProgramCRUDDemo />
    </div>
  );
}