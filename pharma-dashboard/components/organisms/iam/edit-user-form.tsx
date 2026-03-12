"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";

import { Badge } from "@/components/atoms/badge";
import { X } from "lucide-react";
import { type User, type UserRole, type UserStatus } from "@/types";
import { Select, SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from "@/components/atoms/select";

// Form validation schema
const editUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Manager", "Staff", "Viewer"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
  assignedPrograms: z.array(z.string()).default([]),
  status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Status is required" }),
  }),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  user: User;
  onSubmit: (data: EditUserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const userRoles: UserRole[] = ["Manager", "Staff", "Viewer"];
const userStatuses: UserStatus[] = ["Active", "Inactive"];

// Sample program IDs - in a real app, these would come from the programs API
const availablePrograms = [
  { id: "PROG001", name: "Alzheimer's Treatment" },
  { id: "PROG002", name: "Cancer Immunotherapy" },
  { id: "PROG003", name: "Diabetes Prevention" },
  { id: "PROG004", name: "Heart Disease Study" },
];

export function EditUserForm({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditUserFormProps) {
  const [error, setError] = useState<string>("");
  const [newProgram, setNewProgram] = useState<string>("");

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      assignedPrograms: user.assignedPrograms || [],
      status: user.status,
    },
  });

  const watchedPrograms = form.watch("assignedPrograms");

  const handleSubmit = async (data: EditUserFormData) => {
    try {
      setError("");
      await onSubmit(data);
    } catch {
      setError("Failed to update user. Please try again.");
    }
  };

  const addProgram = () => {
    if (newProgram && !watchedPrograms.includes(newProgram)) {
      form.setValue("assignedPrograms", [...watchedPrograms, newProgram]);
      setNewProgram("");
    }
  };

  const removeProgram = (programId: string) => {
    form.setValue(
      "assignedPrograms",
      watchedPrograms.filter((id) => id !== programId)
    );
  };

  const availableProgramOptions = availablePrograms.filter(
    (program) => !watchedPrograms.includes(program.id)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter full name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Assigned Programs */}
        <div className="space-y-3">
          <FormLabel>Assigned Programs</FormLabel>

          {/* Current assigned programs */}
          {watchedPrograms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {watchedPrograms.map((programId) => {
                const program = availablePrograms.find(p => p.id === programId);
                return (
                  <Badge
                    key={programId}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {program?.name || programId}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={() => removeProgram(programId)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Add new program */}
          {availableProgramOptions.length > 0 && (
            <div className="flex gap-2">
              <Select value={newProgram} onValueChange={setNewProgram} disabled={isLoading}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select program to assign" />
                </SelectTrigger>
                <SelectContent>
                  {availableProgramOptions.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProgram}
                disabled={!newProgram || isLoading}
              >
                Add
              </Button>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
