"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Badge } from "@/components/atoms/badge";
import { useAuthStore } from "@/lib/stores/authStore";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Beaker, Shield, Eye, Users, Settings } from "lucide-react";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setUser, setRole } = useAuthStore();

  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("Staff");
  const [isLoading, setIsLoading] = useState(false);

  // Demo user profiles for different roles
  const demoUsers = {
    Manager: {
      id: "MGR001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@pharma.com",
      role: "Manager" as UserRole,
      assignedPrograms: [],
      status: "Active" as const,
      createdAt: new Date("2024-01-15"),
    },
    Staff: {
      id: "STF001",
      name: "Dr. Michael Chen",
      email: "michael.chen@pharma.com",
      role: "Staff" as UserRole,
      assignedPrograms: ["PROG001", "PROG002"],
      status: "Active" as const,
      createdAt: new Date("2024-02-01"),
    },
    Viewer: {
      id: "VWR001",
      name: "Alex Rodriguez",
      email: "alex.rodriguez@pharma.com",
      role: "Viewer" as UserRole,
      assignedPrograms: [],
      status: "Active" as const,
      createdAt: new Date("2024-03-01"),
    },
  };

  const handleLogin = async () => {
    setIsLoading(true);

    // Simulate API login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = demoUsers[selectedRole];
    setUser(user);
    setRole(selectedRole);

    setIsLoading(false);
    router.push("/");
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "Manager":
        return "Full access to create, edit, and manage all programs and users";
      case "Staff":
        return "Can view and contribute to assigned programs and studies";
      case "Viewer":
        return "Read-only access to view programs and basic information";
      default:
        return "";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Manager":
        return Settings;
      case "Staff":
        return Users;
      case "Viewer":
        return Eye;
      default:
        return Shield;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Beaker className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Pharma RCD Login</CardTitle>
          <CardDescription>
            Drug Development Portfolio Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Notice */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Demo Mode</span>
            </div>
            <p className="mt-1 text-blue-600 dark:text-blue-300 text-xs">
              Select a role below to experience different permission levels. No actual authentication required.
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label htmlFor="role">Select Demo Role</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                {(["Manager", "Staff", "Viewer"] as UserRole[]).map((role) => {
                  const Icon = getRoleIcon(role);
                  return (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{role}</span>
                        <Badge
                          variant={role === "Manager" ? "default" : role === "Staff" ? "secondary" : "outline"}
                          className="ml-2 text-xs"
                        >
                          {role === "Manager" ? "Full Access" : role === "Staff" ? "Limited Access" : "View Only"}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getRoleDescription(selectedRole)}
            </p>
          </div>

          {/* User Information Preview */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Demo User Profile</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Name:</strong> {demoUsers[selectedRole].name}</div>
              <div><strong>Email:</strong> {demoUsers[selectedRole].email}</div>
              <div><strong>ID:</strong> {demoUsers[selectedRole].id}</div>
            </div>
          </div>

          {/* Email Input (for demo purposes) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (Demo)</Label>
            <Input
              id="email"
              type="email"
              value={demoUsers[selectedRole].email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : `Sign in as ${selectedRole}`}
          </Button>

          {/* Role Permissions Info */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="font-medium">What you can do as {selectedRole}:</p>
            <ul className="space-y-1 ml-4">
              {selectedRole === "Manager" && (
                <>
                  <li>• Create and manage all programs</li>
                  <li>• Add and manage team members</li>
                  <li>• Set up alerts and notifications</li>
                  <li>• View all financial and sensitive data</li>
                </>
              )}
              {selectedRole === "Staff" && (
                <>
                  <li>• View assigned programs</li>
                  <li>• Add and edit studies</li>
                  <li>• View and contribute to program data</li>
                  <li>• Receive relevant alerts</li>
                </>
              )}
              {selectedRole === "Viewer" && (
                <>
                  <li>• View program portfolio</li>
                  <li>• See basic program information</li>
                  <li>• Access public reports</li>
                  <li>• Limited data visibility</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}