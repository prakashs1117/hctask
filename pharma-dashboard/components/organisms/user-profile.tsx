"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/atoms/dialog";
import { useAuthStore } from "@/lib/stores/authStore";
import { useAuth } from "@/components/providers/auth-guard";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { User, Settings, Shield, Lock, LogOut, Edit } from "lucide-react";
import { rolePermissions } from "@/types";
import type { UserRole } from "@/types";

interface UserProfileProps {
  onLogout?: () => void;
}

/**
 * User profile component with role information and settings
 */
export function UserProfile({ onLogout }: UserProfileProps) {
  const { t } = useTranslation();
  const { currentUser, role, setRole } = useAuthStore();
  const { signOut } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // Mock user data - in real app, this would come from currentUser
  const userDisplayData = {
    name: currentUser?.name || "John Smith",
    email: currentUser?.email || "john.smith@pharma.com",
    id: currentUser?.id || "USR001",
    createdAt: currentUser?.createdAt || new Date("2024-01-15"),
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
  };

  const handleLogout = () => {
    signOut();
    onLogout?.();
    setIsLogoutDialogOpen(false);
  };

  const permissions = rolePermissions[role];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                <p className="font-semibold">{userDisplayData.name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="text-sm">{userDisplayData.email}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">User ID</Label>
                <p className="text-xs font-mono text-muted-foreground">{userDisplayData.id}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Member Since</Label>
                <p className="text-sm">{userDisplayData.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Current Role</Label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={role === "Manager" ? "default" : role === "Staff" ? "secondary" : "outline"}>
                {role}
              </Badge>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Permissions</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {permissions.map((permission) => (
                <Badge key={permission} variant="outline" className="text-xs">
                  {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </div>

          {/* Demo Role Switcher */}
          <div>
            <Label className="text-sm text-muted-foreground">Demo: Switch Role</Label>
            <div className="flex gap-2 mt-2">
              {(["Manager", "Staff", "Viewer"] as UserRole[]).map((roleOption) => (
                <Button
                  key={roleOption}
                  variant={role === roleOption ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRoleChange(roleOption)}
                >
                  {roleOption}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={userDisplayData.name} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={userDisplayData.email} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}