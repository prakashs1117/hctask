"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, TestTube } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} from "@/lib/store/api/apiSlice";
import type { Program } from "@/types";

export function ProgramCRUDDemo() {
  const [selectedId, setSelectedId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    therapeuticArea: "Immunology" as const,
    phase: "Phase I" as const,
    status: "Active" as const,
    manager: "",
    budget: 0,
    progress: 0,
    riskLevel: "Medium" as const,
  });

  // RTK Query hooks
  const { data: programsResponse, isLoading: programsLoading } = useGetProgramsQuery();
  const { data: programResponse, isLoading: programLoading } = useGetProgramByIdQuery(selectedId, {
    skip: !selectedId,
  });

  const [createProgram, { isLoading: creating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: updating }] = useUpdateProgramMutation();
  const [deleteProgram, { isLoading: deleting }] = useDeleteProgramMutation();

  const programs = programsResponse?.data || [];
  const selectedProgram = programResponse?.data;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      const result = await createProgram(formData).unwrap();
      toast.success(`Program created: ${result.data?.name}`);
      setFormData({
        name: "",
        description: "",
        therapeuticArea: "Immunology",
        phase: "Phase I",
        status: "Active",
        manager: "",
        budget: 0,
        progress: 0,
        riskLevel: "Medium",
      });
    } catch (error) {
      console.error("Create failed:", error);
      toast.error("Failed to create program");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      toast.error("Please select a program first");
      return;
    }

    try {
      const result = await updateProgram({ id: selectedId, data: formData }).unwrap();
      toast.success(`Program updated: ${result.data?.name}`);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update program");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      await deleteProgram(id).unwrap();
      toast.success("Program deleted successfully");
      if (selectedId === id) {
        setSelectedId("");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete program");
    }
  };

  const handleLoadProgram = (program: Program) => {
    setSelectedId(program.id);
    setFormData({
      name: program.name,
      description: program.description || "",
      therapeuticArea: program.therapeuticArea as any,
      phase: program.phase as any,
      status: program.status as any,
      manager: program.manager,
      budget: program.budget || 0,
      progress: program.progress || 0,
      riskLevel: program.riskLevel as any,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Program CRUD Operations Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Program Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter program name"
              />
            </div>

            <div>
              <Label htmlFor="manager">Manager *</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                placeholder="Enter manager name"
              />
            </div>

            <div>
              <Label htmlFor="therapeuticArea">Therapeutic Area *</Label>
              <select
                id="therapeuticArea"
                value={formData.therapeuticArea}
                onChange={(e) => handleInputChange("therapeuticArea", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Oncology">Oncology</option>
                <option value="Neurology">Neurology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Immunology">Immunology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Endocrinology">Endocrinology</option>
              </select>
            </div>

            <div>
              <Label htmlFor="phase">Phase *</Label>
              <select
                id="phase"
                value={formData.phase}
                onChange={(e) => handleInputChange("phase", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Preclinical">Preclinical</option>
                <option value="Phase I">Phase I</option>
                <option value="Phase II">Phase II</option>
                <option value="Phase III">Phase III</option>
                <option value="Phase IV">Phase IV</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>

            <div>
              <Label htmlFor="riskLevel">Risk Level</Label>
              <select
                id="riskLevel"
                value={formData.riskLevel}
                onChange={(e) => handleInputChange("riskLevel", e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange("progress", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter program description"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCreate} disabled={creating} className="gap-2">
              <Plus className="h-4 w-4" />
              {creating ? "Creating..." : "Create Program"}
            </Button>

            <Button
              onClick={handleUpdate}
              disabled={updating || !selectedId}
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {updating ? "Updating..." : "Update Program"}
            </Button>
          </div>

          {/* Selected Program Info */}
          {selectedProgram && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Selected Program:</h4>
              <p><strong>ID:</strong> {selectedProgram.id}</p>
              <p><strong>Name:</strong> {selectedProgram.name}</p>
              <p><strong>Last Updated:</strong> {new Date(selectedProgram.updatedAt).toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Programs List */}
      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {programsLoading ? (
            <p>Loading programs...</p>
          ) : (
            <div className="space-y-2">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    selectedId === program.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <div>
                    <div className="font-medium">{program.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {program.phase} • {program.therapeuticArea} • {program.manager}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLoadProgram(program)}
                      className="gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(program.id)}
                      disabled={deleting}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {programs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No programs found. Create one to get started!
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}