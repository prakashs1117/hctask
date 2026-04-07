"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { toast } from "sonner";
import type { MilestoneStatus } from "@/types";

const createStudySchema = z.object({
  name: z.string().min(1, "Study name is required").max(50, "Name too long"),
  title: z.string().min(1, "Study title is required").max(200, "Title too long"),
  targetEnrollment: z.number().min(1, "Target enrollment must be at least 1"),
  milestone: z.enum(["Initiation", "Recruitment", "Analysis", "Complete"]),
  startDate: z.string().min(1, "Start date is required"),
  estimatedEndDate: z.string().min(1, "End date is required"),
});

type CreateStudyData = z.infer<typeof createStudySchema>;

interface CreateStudyDialogProps {
  programId: string;
  trigger?: React.ReactNode;
  onStudyCreated?: () => void;
}

export function CreateStudyDialog({
  programId,
  trigger,
  onStudyCreated
}: CreateStudyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateStudyData>({
    resolver: zodResolver(createStudySchema),
    defaultValues: {
      name: "",
      title: "",
      targetEnrollment: 100,
      milestone: "Initiation",
      startDate: "",
      estimatedEndDate: "",
    },
  });

  const handleSubmit = async (data: CreateStudyData) => {
    try {
      setIsLoading(true);

      // Create study payload
      const studyData = {
        ...data,
        programId,
        enrollmentCount: 0,
        status: "Active" as const,
        startDate: new Date(data.startDate),
        estimatedEndDate: new Date(data.estimatedEndDate),
      };

      // In a real app, this would be an API call
      console.log("Creating study:", studyData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Study created successfully!");
      setOpen(false);
      form.reset();
      onStudyCreated?.();

    } catch (error) {
      console.error("Failed to create study:", error);
      toast.error("Failed to create study. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-1">
      <Plus className="h-3 w-3" />
      Add Study
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Study
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Study Name*</Label>
              <Input
                id="name"
                placeholder="e.g., ALZ-001"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="milestone">Current Milestone*</Label>
              <Select
                value={form.watch("milestone")}
                onValueChange={(value: MilestoneStatus) => form.setValue("milestone", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select milestone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Initiation">Initiation</SelectItem>
                  <SelectItem value="Recruitment">Recruitment</SelectItem>
                  <SelectItem value="Analysis">Analysis</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.milestone && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.milestone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Study Title*</Label>
            <Input
              id="title"
              placeholder="e.g., Safety and Efficacy Study"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="targetEnrollment">Target Enrollment*</Label>
            <Input
              id="targetEnrollment"
              type="number"
              min="1"
              placeholder="e.g., 200"
              {...form.register("targetEnrollment", { valueAsNumber: true })}
            />
            {form.formState.errors.targetEnrollment && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.targetEnrollment.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date*</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
              />
              {form.formState.errors.startDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="estimatedEndDate">Estimated End Date*</Label>
              <Input
                id="estimatedEndDate"
                type="date"
                {...form.register("estimatedEndDate")}
              />
              {form.formState.errors.estimatedEndDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.estimatedEndDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Study"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}