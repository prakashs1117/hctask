import { NextRequest, NextResponse } from "next/server";

// This would typically come from a database or external service
// For demo purposes, we'll use an in-memory store that can be updated via API
let dynamicFeatureFlags = {
  enableIAM: true,
  enablePrograms: true,
  enableDashboard: true,
  enableAlerts: true,
  enableRBAC: true,
  enableDarkMode: true,
  enableI18n: true,
  enableVirtualization: true,
  enableAnalytics: false,
  // Additional runtime-configurable flags
  enableBetaFeatures: false,
  enableMaintenanceMode: false,
  enableAdvancedAnalytics: false,
  enableExperimentalUI: false,
};

// GET /api/v1/feature-flags - Get current feature flags
export async function GET(request: NextRequest) {
  try {
    // You could add user-specific or environment-specific logic here
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const environment = searchParams.get("env") || "production";

    // Simulate user-specific or environment-specific feature flags
    let contextualFlags = { ...dynamicFeatureFlags };

    // Example: Beta features only for specific users or environments
    if (userId === "admin" || environment === "development") {
      contextualFlags.enableBetaFeatures = true;
      contextualFlags.enableExperimentalUI = true;
    }

    // Example: Maintenance mode override
    if (environment === "maintenance") {
      contextualFlags.enableMaintenanceMode = true;
      contextualFlags.enablePrograms = false;
      contextualFlags.enableAlerts = false;
    }

    return NextResponse.json({
      success: true,
      data: contextualFlags,
      timestamp: new Date().toISOString(),
      environment,
      userId,
    });
  } catch (error) {
    console.error("Failed to fetch feature flags:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch feature flags",
        success: false
      },
      { status: 500 }
    );
  }
}

// PUT /api/v1/feature-flags - Update feature flags (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { flags, adminKey } = body;

    // Simple admin authentication (in production, use proper auth)
    if (adminKey !== "admin123") {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Validate the flags structure
    if (!flags || typeof flags !== 'object') {
      return NextResponse.json(
        { error: "Invalid flags data", success: false },
        { status: 400 }
      );
    }

    // Update only the provided flags (partial update)
    dynamicFeatureFlags = {
      ...dynamicFeatureFlags,
      ...flags,
    };

    return NextResponse.json({
      success: true,
      data: dynamicFeatureFlags,
      message: "Feature flags updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to update feature flags:", error);
    return NextResponse.json(
      {
        error: "Failed to update feature flags",
        success: false
      },
      { status: 500 }
    );
  }
}

// POST /api/v1/feature-flags/reset - Reset to defaults
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey } = body;

    if (adminKey !== "admin123") {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    // Reset to defaults
    dynamicFeatureFlags = {
      enableIAM: true,
      enablePrograms: true,
      enableDashboard: true,
      enableAlerts: true,
      enableRBAC: true,
      enableDarkMode: true,
      enableI18n: true,
      enableVirtualization: true,
      enableAnalytics: false,
      enableBetaFeatures: false,
      enableMaintenanceMode: false,
      enableAdvancedAnalytics: false,
      enableExperimentalUI: false,
    };

    return NextResponse.json({
      success: true,
      data: dynamicFeatureFlags,
      message: "Feature flags reset to defaults",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to reset feature flags:", error);
    return NextResponse.json(
      {
        error: "Failed to reset feature flags",
        success: false
      },
      { status: 500 }
    );
  }
}