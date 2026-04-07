"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { AppLayout } from "@/components/layout/app-layout";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Authentication guard that protects the entire application
 * Redirects to login if user is not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, role } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Allow access to login page
    if (pathname === "/login") {
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated (for demo, we check if role is set)
    if (!currentUser && !role) {
      router.push("/login");
      return;
    }

    // User is authenticated
    setIsLoading(false);
  }, [currentUser, role, pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  // If on login page, render without the main app layout
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, don't render anything
  // (user will be redirected to login)
  if (!currentUser && !role) {
    return null;
  }

  // Render authenticated pages with app layout
  return <AppLayout>{children}</AppLayout>;
}

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const { currentUser, role, logout } = useAuthStore();
  const router = useRouter();

  const signOut = () => {
    logout();
    router.push("/login");
  };

  return {
    user: currentUser,
    role,
    isAuthenticated: !!(currentUser || role),
    signOut,
  };
}