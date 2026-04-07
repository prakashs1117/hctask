"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { EmptyState } from "@/components/molecules/empty-state";
import { Shield } from "lucide-react";
import type { UserRole, Permission } from "@/types";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Role-based access guard component
 * Protects content based on user permissions and roles
 */
export function RoleGuard({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback,
  redirectTo,
}: RoleGuardProps) {
  const { role, hasPermission } = useAuthStore();
  const router = useRouter();

  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.includes(role);
  const hasRequiredPermissions = requiredPermissions.length === 0 ||
    requiredPermissions.some(permission => hasPermission(permission));

  const hasAccess = hasRequiredRole && hasRequiredPermissions;

  useEffect(() => {
    if (!hasAccess && redirectTo) {
      router.push(redirectTo);
    }
  }, [hasAccess, redirectTo, router]);

  // Show loading while checking permissions
  if (!role) {
    return <LoadingSpinner message="Checking permissions..." />;
  }

  // If no access and should redirect, don't render anything
  if (!hasAccess && redirectTo) {
    return null;
  }

  // If no access and has fallback, show fallback
  if (!hasAccess && fallback) {
    return <>{fallback}</>;
  }

  // If no access and no fallback, show default access denied
  if (!hasAccess) {
    return (
      <div className="flex h-96 items-center justify-center">
        <EmptyState
          title="Access Denied"
          message={`You don't have permission to access this content. Required role: ${requiredRoles.join(', ') || 'Any'}${requiredPermissions.length > 0 ? `, Required permissions: ${requiredPermissions.join(', ')}` : ''}`}
          icon={Shield}
        />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook for conditional rendering based on permissions
 */
export function useRoleAccess() {
  const { role, hasPermission } = useAuthStore();

  const checkAccess = (requiredPermissions: Permission[] = [], requiredRoles: UserRole[] = []) => {
    const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.includes(role);
    const hasRequiredPermissions = requiredPermissions.length === 0 ||
      requiredPermissions.some(permission => hasPermission(permission));

    return hasRequiredRole && hasRequiredPermissions;
  };

  return { checkAccess, role, hasPermission };
}