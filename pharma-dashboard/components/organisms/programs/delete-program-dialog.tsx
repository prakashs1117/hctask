"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteProgramMutation } from "@/lib/store/api/apiSlice";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { type Program } from "@/types";

interface DeleteProgramDialogProps {
  program: Program;
  canDelete: boolean;
  variant?: "default" | "table" | "detail";
  onDeleted?: () => void;
}

export function DeleteProgramDialog({
  program,
  canDelete,
  variant = "default",
  onDeleted
}: DeleteProgramDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteProgram, { isLoading }] = useDeleteProgramMutation();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteProgram(program.id).unwrap();

      // Close dialog and show success message
      setIsOpen(false);
      toast.success("Program deleted successfully!");

      // Navigate away if on detail page
      if (variant === "detail") {
        router.push("/programs");
      }

      // Call optional callback
      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete program:", error);
      toast.error("Failed to delete program. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!canDelete) {
    return null;
  }

  const getTriggerButton = () => {
    switch (variant) {
      case "table":
        return (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3" />
            <span className="hidden lg:inline text-xs">Delete</span>
          </Button>
        );
      case "detail":
        return (
          <Button
            variant="destructive"
            className="gap-2"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Delete Program
          </Button>
        );
      default:
        return (
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Program
          </Button>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {getTriggerButton()}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Program</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-foreground mb-2">
            Are you sure you want to delete the program:{" "}
            <span className="font-semibold">{program.name}</span>?
          </p>
          <p className="text-xs text-muted-foreground">
            This will permanently delete the program and all associated studies and milestones.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Program"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}