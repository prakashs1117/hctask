"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { useUpdateProgramMutation } from "@/lib/store/api/apiSlice";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { EditProgramForm } from "@/components/organisms/programs/edit-program-form";
import { type Program } from "@/types";

// Form data type for editing programs
type EditProgramFormData = {
  name: string;
  description?: string;
  therapeuticArea: "Oncology" | "Neurology" | "Cardiology" | "Immunology" | "Dermatology" | "Endocrinology";
  phase: "Preclinical" | "Phase I" | "Phase II" | "Phase III" | "Phase IV" | "Approved";
  status: "Active" | "On Hold" | "Completed" | "Discontinued" | "Terminated" | "Pending Approval";
  manager: string;
};

interface EditProgramDialogProps {
  program: Program;
  canEdit: boolean;
  variant?: "default" | "table";
}

export function EditProgramDialog({ program, canEdit, variant = "default" }: EditProgramDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateProgram, { isLoading }] = useUpdateProgramMutation();

  const handleSubmit = async (data: EditProgramFormData) => {
    try {
      await updateProgram({
        id: program.id,
        data: data
      }).unwrap();

      // Close dialog and show success message
      setIsOpen(false);
      toast.success("Program updated successfully!");
    } catch (error) {
      console.error("Failed to update program:", error);
      toast.error("Failed to update program. Please try again.");
      throw error; // Re-throw so form can handle it
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!canEdit) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === "table" ? (
          <Button variant="outline" size="sm" className="gap-1 h-7 px-2 hidden md:inline-flex">
            <Edit className="h-3 w-3" />
            <span className="hidden lg:inline text-xs">Edit</span>
          </Button>
        ) : (
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Program
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="mx-4 w-[calc(100vw-2rem)] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogDescription>
            Update the program information below. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        <EditProgramForm
          program={program}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
