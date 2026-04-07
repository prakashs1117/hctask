import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import * as mockData from "@/lib/data/programs";
import * as dbData from "@/lib/data/programs-db";
import { alerts } from "@/lib/data/alerts-store";

const { getAllPrograms } = env.useMockData ? mockData : dbData;

interface DashboardStats {
  totalPrograms: number;
  activeStudies: number;
  averageEnrollment: number;
  completedMilestones: number;
  upcomingMilestones: number;
  criticalAlerts: number;
  pendingApprovals: number;
  budgetUtilization: number;
  avgTimeToCompletion: number;
}

// GET /api/v1/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const programs = await getAllPrograms();

    // Calculate total programs
    const totalPrograms = programs.length;

    // Calculate active studies
    const activeStudies = programs.reduce((total, program) => {
      return total + program.studies.filter(study => study.status === "Active").length;
    }, 0);

    // Calculate completed milestones
    const completedMilestones = programs.reduce((total, program) => {
      return total + program.milestones.filter(milestone => milestone.completed).length;
    }, 0);

    // Calculate upcoming milestones (due within next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingMilestones = programs.reduce((total, program) => {
      return total + program.milestones.filter(milestone =>
        !milestone.completed &&
        new Date(milestone.dueDate) <= thirtyDaysFromNow
      ).length;
    }, 0);

    // Calculate critical alerts (High priority, Active status)
    const criticalAlerts = alerts.filter(alert =>
      alert.priority === "High" && alert.status === "Active"
    ).length;

    // Calculate pending approvals
    const pendingApprovals = programs.filter(program =>
      program.status === "Pending Approval"
    ).length;

    // Calculate budget utilization (percentage)
    const totalBudget = programs.reduce((sum, program) => sum + (program.budget || 0), 0);
    const utilizedBudget = programs.reduce((sum, program) => {
      const progress = program.progress || 0;
      return sum + (program.budget || 0) * (progress / 100);
    }, 0);

    const budgetUtilization = totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0;

    // Calculate average enrollment percentage
    const totalEnrollment = programs.reduce((sum, program) => {
      return sum + (program.studies?.reduce((studySum, study) => {
        const enrollmentPercentage = study.targetEnrollment > 0
          ? (study.enrollmentCount / study.targetEnrollment) * 100
          : 0;
        return studySum + enrollmentPercentage;
      }, 0) || 0);
    }, 0);

    const totalStudiesCount = programs.reduce((sum, program) => {
      return sum + (program.studies?.length || 0);
    }, 0);

    const averageEnrollment = totalStudiesCount > 0 ? totalEnrollment / totalStudiesCount : 0;

    // Calculate average time to completion (in days)
    const completedPrograms = programs.filter(p => p.status === "Completed");
    const avgTimeToCompletion = completedPrograms.length > 0 ?
      completedPrograms.reduce((sum, program) => {
        const timeDiff = new Date(program.updatedAt).getTime() - new Date(program.createdAt).getTime();
        return sum + (timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
      }, 0) / completedPrograms.length : 0;

    const stats: DashboardStats = {
      totalPrograms,
      activeStudies,
      averageEnrollment: Math.round(averageEnrollment * 10) / 10, // Round to 1 decimal place
      completedMilestones,
      upcomingMilestones,
      criticalAlerts,
      pendingApprovals,
      budgetUtilization,
      avgTimeToCompletion: Math.round(avgTimeToCompletion),
    };

    return NextResponse.json({
      data: stats,
      success: true,
      message: "Dashboard stats retrieved successfully"
    });

  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard stats",
        success: false
      },
      { status: 500 }
    );
  }
}