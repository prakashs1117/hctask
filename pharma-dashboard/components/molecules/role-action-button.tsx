"use client";

import React from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { useRoleAccess } from "@/components/providers/role-guard";
import { Shield, Lock, Eye, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { UserRole, Permission } from "@/types";

interface RoleActionButtonProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showRoleIndicator?: boolean;
  tooltipText?: string;
  fallbackText?: string;
  disabled?: boolean;
}

/**
 * Role-aware action button that shows different states based on user permissions
 */
export const RoleActionButton = React.memo(({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  onClick,
  variant = "default",
  size = "default",
  className,
  showRoleIndicator = true,
  tooltipText,
  fallbackText = "Access Restricted",
  disabled = false,
  ...props
}: RoleActionButtonProps) => {
  const { checkAccess, role, hasPermission } = useRoleAccess();

  const hasAccess = checkAccess(requiredPermissions, requiredRoles);
  const hasPartialAccess = requiredPermissions.some(permission => hasPermission(permission));

  // If user has no access at all, show disabled state with lock icon
  if (!hasAccess && !hasPartialAccess) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn("opacity-50", className)}
        title={tooltipText || `Requires: ${requiredRoles.join(', ') || 'Higher permissions'}`}
        {...props}
      >
        <Lock className="h-4 w-4 mr-2" />
        {fallbackText}
        {showRoleIndicator && (
          <Badge variant="outline" className="ml-2 text-xs">
            {role}
          </Badge>
        )}
      </Button>
    );
  }

  // If user has partial access, show as view-only
  if (!hasAccess && hasPartialAccess) {
    return (
      <Button
        variant="ghost"
        size={size}
        disabled
        className={cn("opacity-75", className)}
        title={tooltipText || "You can view but not modify this content"}
        {...props}
      >
        <Eye className="h-4 w-4 mr-2" />
        View Only
        {showRoleIndicator && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {role}
          </Badge>
        )}
      </Button>
    );
  }

  // User has full access
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      title={tooltipText}
      {...props}
    >
      {children}
      {showRoleIndicator && (
        <Badge
          variant={role === "Manager" ? "default" : role === "Staff" ? "secondary" : "outline"}
          className="ml-2 text-xs"
        >
          {role}
        </Badge>
      )}
    </Button>
  );
});

RoleActionButton.displayName = "RoleActionButton";

/**
 * Information button that shows role-specific guidance
 */
export const RoleInfoButton = React.memo(({
  infoText,
  className,
}: {
  infoText: string;
  className?: string;
}) => {
  const { role } = useRoleAccess();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 w-8 p-0", className)}
      title={infoText}
    >
      <Info className="h-4 w-4" />
      <span className="sr-only">Role information for {role}</span>
    </Button>
  );
});

RoleInfoButton.displayName = "RoleInfoButton";

/**
 * Role indicator badge that shows current permission level
 */
export const RoleIndicator = React.memo(({
  showPermissions = false,
  className,
}: {
  showPermissions?: boolean;
  className?: string;
}) => {
  const { role, hasPermission } = useRoleAccess();

  const getPermissionCount = () => {
    const permissions = [
      "view_programs",
      "create_programs",
      "edit_programs",
      "delete_programs",
      "manage_users",
      "set_alerts",
    ];
    return permissions.filter(p => hasPermission(p as Permission)).length;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant={role === "Manager" ? "default" : role === "Staff" ? "secondary" : "outline"}
      >
        <Shield className="h-3 w-3 mr-1" />
        {role}
      </Badge>
      {showPermissions && (
        <Badge variant="outline" className="text-xs">
          {getPermissionCount()} permissions
        </Badge>
      )}
    </div>
  );
});

RoleIndicator.displayName = "RoleIndicator";