"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";

// Form validation schema
const createProgramSchema = z.object({
  name: z.string().min(1, "Program name is required").max(100, "Name too long"),
  description: z.string().optional(),
  therapeuticArea: z.enum(["Oncology", "Neurology", "Cardiology", "Immunology", "Dermatology", "Endocrinology"]),
  phase: z.enum(["Preclinical", "Phase I", "Phase II", "Phase III", "Phase IV", "Approved"]),
  status: z.enum(["Active", "On Hold", "Completed", "Discontinued", "Terminated", "Pending Approval"]),
  manager: z.string().min(1, "Manager name is required"),
});

type CreateProgramFormData = z.infer<typeof createProgramSchema>;

interface CreateProgramFormProps {
  onSubmit: (data: CreateProgramFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CreateProgramForm({ onSubmit, onCancel, isLoading = false }: CreateProgramFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Memoize default values to prevent re-initialization
  const defaultValues = useMemo(() => ({
    name: "",
    description: "",
    therapeuticArea: "Oncology" as const,
    phase: "Preclinical" as const,
    status: "Active" as const,
    manager: "",
  }), []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateProgramFormData>({
    defaultValues,
  });

  // Memoize form submit handler to prevent unnecessary re-renders
  const handleFormSubmit = useCallback(async (data: CreateProgramFormData) => {
    try {
      setErrors({});

      // Validate with Zod
      const validatedData = createProgramSchema.parse(data);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formErrors);
      } else {
        console.error("Failed to create program:", error);
        setErrors({ general: "Failed to create program. Please try again." });
      }
    }
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 sm:space-y-4">
      {errors.general && (
        <div className="rounded-md bg-destructive/15 p-2 sm:p-3 text-xs sm:text-sm text-destructive leading-tight">
          {errors.general}
        </div>
      )}

      {/* Program Name and Manager - Side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="name" className="text-xs sm:text-sm">Program Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter program name"
            className={`h-8 sm:h-9 md:h-10 text-xs sm:text-sm ${errors.name ? "border-destructive" : ""}`}
          />
          {errors.name && (
            <p className="text-xs text-destructive leading-tight">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="manager" className="text-xs sm:text-sm">Program Manager *</Label>
          <Input
            id="manager"
            {...register("manager")}
            placeholder="Enter manager name"
            className={`h-8 sm:h-9 md:h-10 text-xs sm:text-sm ${errors.manager ? "border-destructive" : ""}`}
          />
          {errors.manager && (
            <p className="text-xs text-destructive leading-tight">{errors.manager}</p>
          )}
        </div>
      </div>

      {/* Description - Full width */}
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter program description (optional)"
          rows={2}
          className="text-xs sm:text-sm resize-none"
        />
      </div>

      {/* Therapeutic Area, Phase, and Status - Three columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="therapeuticArea" className="text-xs sm:text-sm">Therapeutic Area *</Label>
          <select
            id="therapeuticArea"
            {...register("therapeuticArea")}
            className="flex h-8 sm:h-9 md:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-xs sm:file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Oncology">Oncology</option>
            <option value="Neurology">Neurology</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Immunology">Immunology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Endocrinology">Endocrinology</option>
          </select>
          {errors.therapeuticArea && (
            <p className="text-xs text-destructive leading-tight">{errors.therapeuticArea}</p>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="phase" className="text-xs sm:text-sm">Development Phase *</Label>
          <select
            id="phase"
            {...register("phase")}
            className="flex h-8 sm:h-9 md:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-xs sm:file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Preclinical">Preclinical</option>
            <option value="Phase I">Phase I</option>
            <option value="Phase II">Phase II</option>
            <option value="Phase III">Phase III</option>
            <option value="Phase IV">Phase IV</option>
            <option value="Approved">Approved</option>
          </select>
          {errors.phase && (
            <p className="text-xs text-destructive leading-tight">{errors.phase}</p>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="status" className="text-xs sm:text-sm">Status *</Label>
          <select
            id="status"
            {...register("status")}
            className="flex h-8 sm:h-9 md:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-xs sm:file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Discontinued">Discontinued</option>
            <option value="Terminated">Terminated</option>
            <option value="Pending Approval">Pending Approval</option>
          </select>
          {errors.status && (
            <p className="text-xs text-destructive leading-tight">{errors.status}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-3 md:pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isLoading} className="h-8 sm:h-9 text-xs sm:text-sm">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading} className="h-8 sm:h-9 text-xs sm:text-sm">
          {isSubmitting || isLoading ? "Creating..." : "Create Program"}
        </Button>
      </div>
    </form>
  );
}