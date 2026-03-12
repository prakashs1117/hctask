"use client";

import { useState } from "react";
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
import { CreateAlertForm } from "@/components/organisms/alerts/create-alert-form";

// Import the form data type from the form component
type CreateAlertFormData = {
  programId: string;
  studyId?: string;
  program: string;
  study: string;
  deadline: string;
  channel: ("Email" | "SMS" | "Push")[];
  recurring: "One-time" | "Weekly" | "Monthly";
  notifyBefore: number[];
};

interface CreateAlertDialogProps {
  canCreate: boolean;
}

export function CreateAlertDialog({ canCreate }: CreateAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateAlertFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create alert");
      }

      const newAlert = await response.json();
      console.log("Alert created:", newAlert);

      // Close dialog and show success message
      setIsOpen(false);

      // You could add a toast notification here
      alert("Alert created successfully!");

      // Refresh the page to show the new alert
      window.location.reload();
    } catch (error) {
      console.error("Failed to create alert:", error);
      throw error; // Re-throw so form can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!canCreate) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-4 w-[calc(100vw-2rem)] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
          <DialogDescription>
            Set up notifications for program milestones and deadlines. Configure channels and timing for optimal tracking.
          </DialogDescription>
        </DialogHeader>
        <CreateAlertForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}