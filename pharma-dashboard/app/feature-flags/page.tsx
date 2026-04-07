"use client";

import { DynamicFeatureFlagsPanel } from "@/components/organisms/dynamic-feature-flags-panel";
import { I18nDemo } from "@/components/organisms/i18n-demo";
import { PageHeader } from "@/components/organisms/page-header";
import { Settings } from "lucide-react";

export default function FeatureFlagsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Flags Management"
        description="Configure and test application features. Changes to navigation require a page refresh."
        icon={Settings}
      />
      <DynamicFeatureFlagsPanel />
      <I18nDemo />
    </div>
  );
}