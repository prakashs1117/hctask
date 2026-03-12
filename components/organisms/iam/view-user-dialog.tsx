"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Eye, User as UserIcon, Mail, Shield, Briefcase, Calendar, Activity } from "lucide-react";
import { type User } from "@/types";

interface ViewUserDialogProps {
  user: User;
  children?: React.ReactNode;
  variant?: "default" | "table";
}

// Sample program data - in a real app, this would come from the programs API
const programData: Record<string, string> = {
  "PROG001": "Alzheimer's Treatment Program",
  "PROG002": "Cancer Immunotherapy Research",
  "PROG003": "Diabetes Prevention Study",
  "PROG004": "Heart Disease Clinical Trial",
};

export function ViewUserDialog({
  user,
  children,
  variant = "default"
}: ViewUserDialogProps) {
  const [open, setOpen] = useState(false);

  const triggerButton = children || (
    <Button
      variant={variant === "table" ? "ghost" : "outline"}
      size={variant === "table" ? "sm" : "default"}
      className={variant === "table" ? "gap-1" : "gap-2"}
    >
      {variant === "table" ? (
        <>
          <Eye className="h-3 w-3" />
          View
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          View Details
        </>
      )}
    </Button>
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Manager":
        return "default";
      case "Staff":
        return "secondary";
      case "Viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <UserIcon className="h-3 w-3" />
                    Full Name
                  </div>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Mail className="h-3 w-3" />
                    Email Address
                  </div>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Shield className="h-3 w-3" />
                    Role
                  </div>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Activity className="h-3 w-3" />
                    Status
                  </div>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Assignments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Program Assignments
                <Badge variant="outline" className="ml-auto">
                  {user.assignedPrograms.length} programs
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.assignedPrograms.length > 0 ? (
                <div className="grid gap-3">
                  {user.assignedPrograms.map((programId) => (
                    <div
                      key={programId}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">
                          {programData[programId] || `Program ${programId}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {programId}
                        </p>
                      </div>
                      <Badge variant="outline">Assigned</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No programs assigned</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    Account Created
                  </div>
                  <p className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <UserIcon className="h-3 w-3" />
                    User ID
                  </div>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {user.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
