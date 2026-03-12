"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import { usePrograms } from "@/lib/hooks/usePrograms";
import { type NotificationChannel } from "@/types";
import { Calendar, Clock, Bell, Mail, MessageSquare, Smartphone, type LucideIcon } from "lucide-react";

// Form validation schema
const createAlertSchema = z.object({
  programId: z.string().min(1, "Program selection is required"),
  studyId: z.string().optional(),
  program: z.string().min(1, "Program name is required"),
  study: z.string().min(1, "Study name is required"),
  deadline: z.string().min(1, "Deadline is required"),
  channel: z.array(z.enum(["Email", "SMS", "Push"])).min(1, "At least one notification channel is required"),
  recurring: z.enum(["One-time", "Weekly", "Monthly"]),
  notifyBefore: z.array(z.number()).min(1, "At least one notification period is required"),
});

type CreateAlertFormData = z.infer<typeof createAlertSchema>;

interface CreateAlertFormProps {
  onSubmit: (data: CreateAlertFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const notificationChannels: { value: NotificationChannel; label: string; icon: LucideIcon; description: string }[] = [
  { value: "Email", label: "Email", icon: Mail, description: "Email notifications" },
  { value: "SMS", label: "SMS", icon: MessageSquare, description: "Text message alerts" },
  { value: "Push", label: "Push", icon: Smartphone, description: "Browser push notifications" },
];

const notifyBeforeOptions = [
  { value: 1, label: "1 day before" },
  { value: 3, label: "3 days before" },
  { value: 7, label: "7 days before" },
  { value: 14, label: "14 days before" },
  { value: 30, label: "30 days before" },
];

export function CreateAlertForm({ onSubmit, onCancel, isLoading = false }: CreateAlertFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: programs } = usePrograms();
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(["Email"]);
  const [selectedNotifyBefore, setSelectedNotifyBefore] = useState<number[]>([7]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm<CreateAlertFormData>({
    defaultValues: {
      programId: "",
      studyId: "",
      program: "",
      study: "",
      deadline: "",
      channel: ["Email"],
      recurring: "One-time",
      notifyBefore: [7],
    },
  });

  const selectedProgramId = watch("programId");
  const selectedProgram = programs?.find(p => p.id === selectedProgramId);

  useEffect(() => {
    if (selectedProgram) {
      setValue("program", selectedProgram.name);
    }
  }, [selectedProgram, setValue]);

  useEffect(() => {
    setValue("channel", selectedChannels);
  }, [selectedChannels, setValue]);

  useEffect(() => {
    setValue("notifyBefore", selectedNotifyBefore);
  }, [selectedNotifyBefore, setValue]);

  const handleFormSubmit = async (data: CreateAlertFormData) => {
    try {
      setErrors({});

      // Validate with Zod
      const validatedData = createAlertSchema.parse(data);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formErrors);
      } else {
        console.error("Failed to create alert:", error);
        setErrors({ general: "Failed to create alert. Please try again." });
      }
    }
  };

  const toggleChannel = (channel: NotificationChannel) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const toggleNotifyBefore = (days: number) => {
    setSelectedNotifyBefore(prev =>
      prev.includes(days)
        ? prev.filter(d => d !== days)
        : [...prev, days].sort((a, b) => b - a)
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {errors.general && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errors.general}
        </div>
      )}

      {/* Program and Study Selection - Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="programId">Select Program *</Label>
          <select
            id="programId"
            {...register("programId")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Choose a program...</option>
            {programs?.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name} ({program.id})
              </option>
            ))}
          </select>
          {errors.programId && (
            <p className="text-sm text-destructive">{errors.programId}</p>
          )}
        </div>

        {/* Study Selection */}
        {selectedProgram && (
          <div className="space-y-2">
            <Label htmlFor="study">Study/Scope *</Label>
            <select
              id="study"
              {...register("study")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Choose study scope...</option>
              <option value="All studies">All studies in program</option>
              {selectedProgram.studies.map((study) => (
                <option key={study.id} value={study.name}>
                  {study.name} - {study.title}
                </option>
              ))}
            </select>
            {errors.study && (
              <p className="text-sm text-destructive">{errors.study}</p>
            )}
          </div>
        )}
      </div>

      {/* Deadline and Recurring - Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="deadline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Alert Deadline *
          </Label>
          <Input
            id="deadline"
            type="datetime-local"
            {...register("deadline")}
            className={errors.deadline ? "border-destructive" : ""}
          />
          {errors.deadline && (
            <p className="text-sm text-destructive">{errors.deadline}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recurring">Recurrence Pattern</Label>
          <select
            id="recurring"
            {...register("recurring")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="One-time">One-time alert</option>
            <option value="Weekly">Weekly reminder</option>
            <option value="Monthly">Monthly reminder</option>
          </select>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notification Channels *
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {notificationChannels.map((channel) => {
            const Icon = channel.icon;
            const isSelected = selectedChannels.includes(channel.value);

            return (
              <div
                key={channel.value}
                onClick={() => toggleChannel(channel.value)}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{channel.label}</span>
                  {isSelected && (
                    <Badge variant="default" className="ml-auto">
                      Selected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {channel.description}
                </p>
              </div>
            );
          })}
        </div>
        {errors.channel && (
          <p className="text-sm text-destructive">{errors.channel}</p>
        )}
      </div>

      {/* Notify Before */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Notify Before Deadline *
        </Label>
        <div className="flex flex-wrap gap-2">
          {notifyBeforeOptions.map((option) => {
            const isSelected = selectedNotifyBefore.includes(option.value);

            return (
              <Button
                key={option.value}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleNotifyBefore(option.value)}
                className="gap-1"
              >
                {option.label}
                {isSelected && "✓"}
              </Button>
            );
          })}
        </div>
        {errors.notifyBefore && (
          <p className="text-sm text-destructive">{errors.notifyBefore}</p>
        )}
      </div>


      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading || selectedChannels.length === 0}>
          {isSubmitting || isLoading ? "Creating Alert..." : "Create Alert"}
        </Button>
      </div>
    </form>
  );
}