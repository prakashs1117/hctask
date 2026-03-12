"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { CreateProgramForm } from "@/components/organisms/programs/create-program-form";

// Import the form data type
type CreateProgramFormData = {
  name: string;
  description?: string;
  therapeuticArea: "Oncology" | "Neurology" | "Cardiology" | "Immunology" | "Dermatology" | "Endocrinology";
  phase: "Preclinical" | "Phase I" | "Phase II" | "Phase III" | "Phase IV" | "Approved";
  status: "Active" | "On Hold" | "Completed" | "Discontinued";
  manager: string;
};

interface CreateProgramDialogProps {
  canCreate: boolean;
}

export function CreateProgramDialog({ canCreate }: CreateProgramDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSubmit = useCallback(async (data: CreateProgramFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      const newProgram = await response.json();
      console.log("Program created:", newProgram);

      // Close dialog and show success message
      setIsOpen(false);

      toast.success("Program created successfully!");

      // Refresh the page to show the new program
      window.location.reload();
    } catch (error) {
      console.error("Failed to create program:", error);
      toast.error("Failed to create program. Please try again.");
      throw error; // Re-throw so form can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!canCreate) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Program
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-4 w-[calc(100vw-2rem)] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Program</DialogTitle>
          <DialogDescription>
            Create a new drug development program. Fill out the required information below.
          </DialogDescription>
        </DialogHeader>
        <CreateProgramForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}