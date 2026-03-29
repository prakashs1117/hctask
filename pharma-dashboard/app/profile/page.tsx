"use client";

import { UserProfile } from "@/components/organisms/user-profile";
import { PageHeader } from "@/components/organisms/page-header";
import { RoleGuard } from "@/components/providers/role-guard";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <RoleGuard>
      <div className="space-y-6">
        <PageHeader
          title="User Profile"
          description="Manage your account settings and preferences"
          icon={User}
        />

        <UserProfile />
      </div>
    </RoleGuard>
  );
}