"use client";

import { SwaggerUIWrapper } from "@/components/molecules/swagger-ui-wrapper";
import { PageHeader } from "@/components/organisms/page-header";
import { RoleGuard } from "@/components/providers/role-guard";
import { FileText } from "lucide-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <RoleGuard>
      <div className="space-y-6">
        <PageHeader
          title="API Documentation"
          description="Interactive API documentation for the Pharma RCD system"
          icon={FileText}
        />

        <SwaggerUIWrapper
          url="/api/v1/api-docs"
          title="Pharma RCD API"
        />
      </div>
    </RoleGuard>
  );
}
