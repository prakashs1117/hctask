"use client";

import React from "react";
import { EmptyState } from "@/components/molecules/empty-state";
import { RoleActionButton } from "@/components/molecules/role-action-button";
import { useRoleAccess } from "@/components/providers/role-guard";
import { Shield, Plus, Eye, Lock, Users, BarChart3, AlertTriangle } from "lucide-react";
import type { UserRole, Permission } from "@/types";

interface RoleEmptyStateProps {
  type: "programs" | "studies" | "users" | "alerts";
  onAction?: () => void;
  onClearFilters?: () => void;
  className?: string;
}

/**
 * Role-aware empty state that shows different content and actions based on user permissions
 */
export const RoleEmptyState = React.memo(({
  type,
  onAction,
  onClearFilters,
  className
}: RoleEmptyStateProps) => {
  const { role, checkAccess } = useRoleAccess();

  const getEmptyStateConfig = () => {
    switch (type) {
      case "programs":
        return {
          title: role === "Manager"
            ? "No Programs Found"
            : role === "Staff"
            ? "No Assigned Programs"
            : "No Programs Available",
          message: role === "Manager"
            ? "Get started by creating your first drug development program."
            : role === "Staff"
            ? "You don't have any programs assigned to you yet. Contact your manager to get access to programs."
            : "You currently don't have access to view programs. Contact your administrator for access.",
          icon: BarChart3,
          actionText: role === "Manager" ? "Create First Program" : "Request Access",
          actionPermissions: ["create_programs"] as Permission[],
        };

      case "studies":
        return {
          title: role === "Manager"
            ? "No Studies Found"
            : role === "Staff"
            ? "No Studies to Review"
            : "No Studies Available",
          message: role === "Manager"
            ? "This program doesn't have any studies yet. Add the first study to get started."
            : role === "Staff"
            ? "No studies are currently assigned for your review."
            : "You don't have permission to view studies in this program.",
          icon: BarChart3,
          actionText: role === "Manager" ? "Add First Study" : role === "Staff" ? "Check Later" : "Contact Admin",
          actionPermissions: ["add_studies"] as Permission[],
        };

      case "users":
        return {
          title: role === "Manager"
            ? "No Team Members"
            : "No Users Found",
          message: role === "Manager"
            ? "Build your team by adding the first team member to manage programs."
            : "You don't have permission to view team members.",
          icon: Users,
          actionText: role === "Manager" ? "Add Team Member" : "Access Denied",
          actionPermissions: ["manage_users"] as Permission[],
        };

      case "alerts":
        return {
          title: role === "Manager"
            ? "No Alerts Set Up"
            : role === "Staff"
            ? "No Active Alerts"
            : "No Alerts Available",
          message: role === "Manager"
            ? "Set up your first alert to stay informed about program milestones and deadlines."
            : role === "Staff"
            ? "No alerts are currently active for your assigned programs."
            : "You don't have permission to view alerts.",
          icon: AlertTriangle,
          actionText: role === "Manager" ? "Create Alert" : role === "Staff" ? "View Programs" : "Contact Admin",
          actionPermissions: ["set_alerts"] as Permission[],
        };

      default:
        return {
          title: "No Data Found",
          message: "No information is available for your current role.",
          icon: Eye,
          actionText: "Refresh",
          actionPermissions: [] as Permission[],
        };
    }
  };

  const config = getEmptyStateConfig();
  const hasActionPermission = checkAccess(config.actionPermissions);

  const roleSpecificMessage = (
    <div className="space-y-4">
      <p className="text-muted-foreground">{config.message}</p>

      {/* Role-specific guidance */}
      {role === "Viewer" && (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg text-sm">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>You have view-only access. Contact your administrator to request additional permissions.</span>
        </div>
      )}

      {role === "Staff" && !hasActionPermission && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm">
          <Eye className="h-4 w-4 text-blue-600" />
          <span>As a Staff member, you can view and contribute to assigned programs.</span>
        </div>
      )}

      {role === "Manager" && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-sm">
          <Shield className="h-4 w-4 text-green-600" />
          <span>As a Manager, you have full control to create and manage content.</span>
        </div>
      )}
    </div>
  );

  return (
    <EmptyState
      title={config.title}
      message={roleSpecificMessage}
      icon={config.icon}
      className={className}
      action={hasActionPermission && onAction ? (
        <RoleActionButton
          requiredPermissions={config.actionPermissions}
          onClick={onAction}
          showRoleIndicator={false}
        >
          <Plus className="h-4 w-4 mr-2" />
          {config.actionText}
        </RoleActionButton>
      ) : role === "Viewer" ? (
        <RoleActionButton
          requiredPermissions={["view_programs"]}
          variant="outline"
          showRoleIndicator
          disabled
        >
          <Lock className="h-4 w-4 mr-2" />
          {config.actionText}
        </RoleActionButton>
      ) : undefined}
      onClear={onClearFilters}
    />
  );
});

RoleEmptyState.displayName = "RoleEmptyState";

/**
 * Access denied empty state for completely restricted content
 */
export const AccessDeniedState = React.memo(({
  requiredRole,
  requiredPermissions = [],
  className,
}: {
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  className?: string;
}) => {
  const { role } = useRoleAccess();

  return (
    <EmptyState
      title="Access Restricted"
      message={
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You don't have the necessary permissions to access this content.
          </p>

          {requiredRole && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg text-sm">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Required Role: {requiredRole}</span>
              </div>
              <div className="mt-1 text-red-600 dark:text-red-300">
                Your current role: {role}
              </div>
            </div>
          )}

          {requiredPermissions.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-sm">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Required Permissions:</span>
              </div>
              <ul className="mt-1 space-y-1 text-amber-600 dark:text-amber-300">
                {requiredPermissions.map(permission => (
                  <li key={permission} className="ml-4">
                    • {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Contact your administrator to request the necessary permissions.
          </p>
        </div>
      }
      icon={Shield}
      className={className}
    />
  );
});

AccessDeniedState.displayName = "AccessDeniedState";