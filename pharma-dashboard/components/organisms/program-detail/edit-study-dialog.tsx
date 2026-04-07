"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Calendar } from "lucide-react";
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
import type { Study, MilestoneStatus } from "@/types";

const editStudySchema = z.object({
  name: z.string().min(1, "Study name is required").max(50, "Name too long"),
  title: z.string().min(1, "Study title is required").max(200, "Title too long"),
  targetEnrollment: z.number().min(1, "Target enrollment must be at least 1"),
  enrollmentCount: z.number().min(0, "Enrollment count cannot be negative"),
  milestone: z.enum(["Initiation", "Recruitment", "Analysis", "Complete"]),
  startDate: z.string().min(1, "Start date is required"),
  estimatedEndDate: z.string().min(1, "End date is required"),
});

type EditStudyData = z.infer<typeof editStudySchema>;

interface EditStudyDialogProps {
  study: Study;
  trigger?: React.ReactNode;
  onStudyUpdated?: () => void;
}

export function EditStudyDialog({
  study,
  trigger,
  onStudyUpdated
}: EditStudyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditStudyData>({
    resolver: zodResolver(editStudySchema),
    defaultValues: {
      name: study.name,
      title: study.title,
      targetEnrollment: study.targetEnrollment,
      enrollmentCount: study.enrollmentCount,
      milestone: study.milestone,
      startDate: study.startDate.toISOString().split('T')[0],
      estimatedEndDate: study.estimatedEndDate.toISOString().split('T')[0],
    },
  });

  // Reset form when study changes
  useEffect(() => {
    form.reset({
      name: study.name,
      title: study.title,
      targetEnrollment: study.targetEnrollment,
      enrollmentCount: study.enrollmentCount,
      milestone: study.milestone,
      startDate: study.startDate.toISOString().split('T')[0],
      estimatedEndDate: study.estimatedEndDate.toISOString().split('T')[0],
    });
  }, [study, form]);

  const handleSubmit = async (data: EditStudyData) => {
    try {
      setIsLoading(true);

      // Create updated study payload
      const updatedStudy = {
        ...study,
        ...data,
        startDate: new Date(data.startDate),
        estimatedEndDate: new Date(data.estimatedEndDate),
      };

      // In a real app, this would be an API call
      console.log("Updating study:", updatedStudy);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Study updated successfully!");
      setOpen(false);
      onStudyUpdated?.();

    } catch (error) {
      console.error("Failed to update study:", error);
      toast.error("Failed to update study. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-1">
      <Edit className="h-3 w-3" />
      Edit
    </Button>
  );

  const enrollmentCount = form.watch("enrollmentCount");
  const targetEnrollment = form.watch("targetEnrollment");
  const enrollmentPercentage = targetEnrollment > 0 ? (enrollmentCount / targetEnrollment) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Study: {study.name}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="enrollmentCount">Current Enrollment*</Label>
              <Input
                id="enrollmentCount"
                type="number"
                min="0"
                {...form.register("enrollmentCount", { valueAsNumber: true })}
              />
              {form.formState.errors.enrollmentCount && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.enrollmentCount.message}
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
          </div>

          {/* Enrollment Progress Indicator */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Enrollment Progress</span>
              <span className="text-sm text-muted-foreground">
                {enrollmentCount}/{targetEnrollment} ({enrollmentPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
              />
            </div>
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
              {isLoading ? "Updating..." : "Update Study"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}