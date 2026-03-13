"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { EditUserForm } from "@/components/organisms/iam/edit-user-form";
import { toast } from "sonner";
import { Shield, Edit2 } from "lucide-react";
import { type User } from "@/types";

interface EditUserDialogProps {
  user: User;
  canEdit: boolean;
  children?: React.ReactNode;
  variant?: "default" | "table";
}

type UpdateUserData = {
  name: string;
  email: string;
  role: "Manager" | "Staff" | "Viewer";
  assignedPrograms: string[];
  status: "Active" | "Inactive";
};

export function EditUserDialog({
  user,
  canEdit,
  children,
  variant = "default"
}: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await fetch(`/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: (updatedUser) => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(["users", user.id], updatedUser);

      setOpen(false);
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const handleSubmit = async (data: UpdateUserData) => {
    await updateUserMutation.mutateAsync(data);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  if (!canEdit) {
    return null;
  }

  const triggerButton = children || (
    <Button
      variant={variant === "table" ? "ghost" : "default"}
      size={variant === "table" ? "sm" : "default"}
      className={variant === "table" ? "gap-1" : "gap-2"}
    >
      {variant === "table" ? (
        <>
          <Edit2 className="h-3 w-3" />
          Edit
        </>
      ) : (
        <>
          <Shield className="h-4 w-4" />
          Edit User
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Edit User
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <EditUserForm
            user={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updateUserMutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
