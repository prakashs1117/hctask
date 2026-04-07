/**
 * OpenAPI 3.0 specification for the Pharma Dashboard API
 */
export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Pharma Dashboard API",
    version: "1.0.0",
    description:
      "REST API for managing pharmaceutical drug development programs, users, and alerts.",
  },
  servers: [
    {
      url: "/",
      description: "Current environment",
    },
  ],
  paths: {
    "/api/v1/programs": {
      get: {
        tags: ["Programs"],
        summary: "List all programs",
        description:
          "Returns a filtered list of programs. All query parameters are optional.",
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description:
              "Search by program name, description, or manager (case-insensitive)",
          },
          {
            name: "phase",
            in: "query",
            schema: { $ref: "#/components/schemas/Phase" },
            description: "Filter by development phase",
          },
          {
            name: "therapeuticArea",
            in: "query",
            schema: { $ref: "#/components/schemas/TherapeuticArea" },
            description: "Filter by therapeutic area",
          },
          {
            name: "status",
            in: "query",
            schema: { $ref: "#/components/schemas/ProgramStatus" },
            description: "Filter by program status",
          },
        ],
        responses: {
          "200": {
            description: "List of programs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Program" },
                    },
                    totalCount: { type: "integer", description: "Total number of programs before filtering" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Programs"],
        summary: "Create a new program",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProgramInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Program created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Program" },
              },
            },
          },
          "400": {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/programs/{id}": {
      get: {
        tags: ["Programs"],
        summary: "Get a program by ID",
        description: "Returns a single program with its studies and milestones.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Program details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Program" },
              },
            },
          },
          "404": {
            description: "Program not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Programs"],
        summary: "Update a program",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProgramInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Program updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Program" },
              },
            },
          },
          "404": {
            description: "Program not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Programs"],
        summary: "Delete a program",
        description:
          "Deletes a program and cascades to its studies and milestones.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Program deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Program deleted successfully" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Program not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "List all users",
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    totalCount: { type: "integer", description: "Total number of users" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "User details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update a user",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "User updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "User deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/alerts": {
      get: {
        tags: ["Alerts"],
        summary: "List alerts",
        description: "Returns alerts optionally filtered by program and status.",
        parameters: [
          {
            name: "programId",
            in: "query",
            schema: { type: "string" },
            description: "Filter by program ID",
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["Active", "Overdue", "Dismissed"],
            },
            description: "Filter by alert status",
          },
        ],
        responses: {
          "200": {
            description: "List of alerts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Alert" },
                    },
                    totalCount: { type: "integer", description: "Total number of alerts before filtering" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Alerts"],
        summary: "Create a new alert",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AlertInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Alert created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Alert" },
              },
            },
          },
          "400": {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/alerts/{id}": {
      get: {
        tags: ["Alerts"],
        summary: "Get an alert by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Alert details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Alert" },
              },
            },
          },
          "404": {
            description: "Alert not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Alerts"],
        summary: "Update an alert",
        description: "Partially update an alert. Only provided fields are updated.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AlertUpdate" },
            },
          },
        },
        responses: {
          "200": {
            description: "Alert updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Alert" },
              },
            },
          },
          "404": {
            description: "Alert not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Alerts"],
        summary: "Delete an alert",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Alert deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Alert deleted successfully" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Alert not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/feature-flags": {
      get: {
        tags: ["Feature Flags"],
        summary: "Get current feature flags",
        description: "Returns the current state of all feature flags. Supports user-specific and environment-specific configurations.",
        parameters: [
          {
            name: "userId",
            in: "query",
            schema: { type: "string" },
            description: "User ID for user-specific feature flags (optional)",
            example: "admin"
          },
          {
            name: "env",
            in: "query",
            schema: {
              type: "string",
              enum: ["development", "staging", "production", "maintenance"],
              default: "production"
            },
            description: "Environment for environment-specific feature flags",
            example: "development"
          },
        ],
        responses: {
          "200": {
            description: "Current feature flags configuration",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/FeatureFlags" },
                    timestamp: { type: "string", format: "date-time", example: "2026-04-05T13:55:25.642Z" },
                    environment: { type: "string", example: "production" },
                    userId: { type: "string", nullable: true, example: "admin" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Feature Flags"],
        summary: "Update feature flags",
        description: "Update specific feature flags. Requires admin authentication. Only provided flags are updated (partial update).",
        security: [{ AdminKey: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FeatureFlagsUpdate" },
            },
          },
        },
        responses: {
          "200": {
            description: "Feature flags updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/FeatureFlags" },
                    message: { type: "string", example: "Feature flags updated successfully" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid request data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid or missing admin key",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/feature-flags/reset": {
      post: {
        tags: ["Feature Flags"],
        summary: "Reset feature flags to defaults",
        description: "Resets all feature flags to their default values. Requires admin authentication. This action cannot be undone.",
        security: [{ AdminKey: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["adminKey"],
                properties: {
                  adminKey: {
                    type: "string",
                    description: "Admin authentication key",
                    example: "admin123"
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Feature flags reset to defaults",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/FeatureFlags" },
                    message: { type: "string", example: "Feature flags reset to defaults" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - Invalid or missing admin key",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        summary: "Get dashboard statistics",
        description: "Returns computed statistics for the dashboard including program counts, study metrics, and enrollment data.",
        responses: {
          "200": {
            description: "Dashboard statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/DashboardStats" },
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Dashboard stats retrieved successfully" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Phase: {
        type: "string",
        enum: [
          "Preclinical",
          "Phase I",
          "Phase II",
          "Phase III",
          "Phase IV",
          "Approved",
        ],
      },
      TherapeuticArea: {
        type: "string",
        enum: [
          "Oncology",
          "Neurology",
          "Cardiology",
          "Immunology",
          "Dermatology",
          "Endocrinology",
        ],
      },
      ProgramStatus: {
        type: "string",
        enum: ["Active", "On Hold", "Completed", "Discontinued"],
      },
      MilestoneStatus: {
        type: "string",
        enum: ["Initiation", "Recruitment", "Analysis", "Complete"],
      },
      UserRole: {
        type: "string",
        enum: ["Manager", "Staff", "Viewer"],
      },
      UserStatus: {
        type: "string",
        enum: ["Active", "Inactive"],
      },
      NotificationChannel: {
        type: "string",
        enum: ["Email", "SMS", "Push"],
      },
      Program: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          therapeuticArea: { $ref: "#/components/schemas/TherapeuticArea" },
          phase: { $ref: "#/components/schemas/Phase" },
          status: { $ref: "#/components/schemas/ProgramStatus" },
          manager: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          studies: {
            type: "array",
            items: { $ref: "#/components/schemas/Study" },
          },
          milestones: {
            type: "array",
            items: { $ref: "#/components/schemas/Milestone" },
          },
        },
      },
      ProgramInput: {
        type: "object",
        required: ["name", "therapeuticArea", "phase", "status", "manager"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          therapeuticArea: { $ref: "#/components/schemas/TherapeuticArea" },
          phase: { $ref: "#/components/schemas/Phase" },
          status: { $ref: "#/components/schemas/ProgramStatus" },
          manager: { type: "string" },
        },
      },
      Study: {
        type: "object",
        properties: {
          id: { type: "string" },
          programId: { type: "string" },
          name: { type: "string" },
          title: { type: "string" },
          enrollmentCount: { type: "integer" },
          targetEnrollment: { type: "integer" },
          milestone: { $ref: "#/components/schemas/MilestoneStatus" },
          status: { $ref: "#/components/schemas/ProgramStatus" },
          startDate: { type: "string", format: "date-time" },
          estimatedEndDate: { type: "string", format: "date-time" },
        },
      },
      Milestone: {
        type: "object",
        properties: {
          id: { type: "string" },
          programId: { type: "string" },
          label: { type: "string" },
          dueDate: { type: "string", format: "date-time" },
          completed: { type: "boolean" },
          completedDate: { type: "string", format: "date-time", nullable: true },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { $ref: "#/components/schemas/UserRole" },
          assignedPrograms: {
            type: "array",
            items: { type: "string" },
            description: "Array of program IDs",
          },
          status: { $ref: "#/components/schemas/UserStatus" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      UserInput: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { $ref: "#/components/schemas/UserRole" },
          assignedPrograms: {
            type: "array",
            items: { type: "string" },
          },
          status: { $ref: "#/components/schemas/UserStatus" },
        },
      },
      Alert: {
        type: "object",
        properties: {
          id: { type: "string" },
          programId: { type: "string" },
          studyId: { type: "string", nullable: true },
          program: { type: "string", description: "Program name" },
          study: { type: "string", description: "Study name or 'All studies'" },
          deadline: { type: "string", format: "date-time" },
          channel: {
            type: "array",
            items: { $ref: "#/components/schemas/NotificationChannel" },
          },
          status: {
            type: "string",
            enum: ["Active", "Overdue", "Dismissed"],
          },
          recurring: {
            type: "string",
            enum: ["One-time", "Weekly", "Monthly"],
          },
          notifyBefore: {
            type: "array",
            items: { type: "integer" },
            description: "Days before deadline to notify",
          },
        },
      },
      AlertInput: {
        type: "object",
        required: ["programId", "program", "study", "deadline", "channel", "recurring", "notifyBefore"],
        properties: {
          programId: { type: "string" },
          program: { type: "string" },
          study: { type: "string" },
          deadline: { type: "string", format: "date-time" },
          channel: {
            type: "array",
            items: { $ref: "#/components/schemas/NotificationChannel" },
          },
          recurring: {
            type: "string",
            enum: ["One-time", "Weekly", "Monthly"],
          },
          notifyBefore: {
            type: "array",
            items: { type: "integer" },
          },
        },
      },
      AlertUpdate: {
        type: "object",
        description: "Partial update for an alert. All fields are optional.",
        properties: {
          programId: { type: "string" },
          program: { type: "string" },
          study: { type: "string" },
          deadline: { type: "string", format: "date-time" },
          channel: {
            type: "array",
            items: { $ref: "#/components/schemas/NotificationChannel" },
          },
          status: {
            type: "string",
            enum: ["Active", "Overdue", "Dismissed"],
          },
          recurring: {
            type: "string",
            enum: ["One-time", "Weekly", "Monthly"],
          },
          notifyBefore: {
            type: "array",
            items: { type: "integer" },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      FeatureFlags: {
        type: "object",
        description: "Complete feature flags configuration object",
        properties: {
          enableIAM: {
            type: "boolean",
            description: "Enable Identity & Access Management module",
            example: true
          },
          enablePrograms: {
            type: "boolean",
            description: "Enable Programs management module",
            example: true
          },
          enableDashboard: {
            type: "boolean",
            description: "Enable main dashboard module",
            example: true
          },
          enableAlerts: {
            type: "boolean",
            description: "Enable alerts and notifications system",
            example: true
          },
          enableRBAC: {
            type: "boolean",
            description: "Enable role-based access control",
            example: true
          },
          enableDarkMode: {
            type: "boolean",
            description: "Enable dark mode theme toggle",
            example: true
          },
          enableI18n: {
            type: "boolean",
            description: "Enable internationalization support",
            example: true
          },
          enableVirtualization: {
            type: "boolean",
            description: "Enable virtual scrolling for large lists",
            example: true
          },
          enableAnalytics: {
            type: "boolean",
            description: "Enable analytics and tracking",
            example: false
          },
          enableBetaFeatures: {
            type: "boolean",
            description: "Enable experimental beta features",
            example: false
          },
          enableMaintenanceMode: {
            type: "boolean",
            description: "Enable maintenance mode (limited access)",
            example: false
          },
          enableAdvancedAnalytics: {
            type: "boolean",
            description: "Enable advanced analytics and reporting",
            example: false
          },
          enableExperimentalUI: {
            type: "boolean",
            description: "Enable experimental UI components",
            example: false
          },
        },
      },
      FeatureFlagsUpdate: {
        type: "object",
        description: "Partial feature flags update request",
        required: ["adminKey"],
        properties: {
          adminKey: {
            type: "string",
            description: "Admin authentication key",
            example: "admin123"
          },
          flags: {
            type: "object",
            description: "Partial feature flags to update. Only provided flags will be updated.",
            properties: {
              enableIAM: { type: "boolean" },
              enablePrograms: { type: "boolean" },
              enableDashboard: { type: "boolean" },
              enableAlerts: { type: "boolean" },
              enableRBAC: { type: "boolean" },
              enableDarkMode: { type: "boolean" },
              enableI18n: { type: "boolean" },
              enableVirtualization: { type: "boolean" },
              enableAnalytics: { type: "boolean" },
              enableBetaFeatures: { type: "boolean" },
              enableMaintenanceMode: { type: "boolean" },
              enableAdvancedAnalytics: { type: "boolean" },
              enableExperimentalUI: { type: "boolean" },
            },
            example: {
              "enableDarkMode": false,
              "enableI18n": true
            }
          },
        },
      },
      DashboardStats: {
        type: "object",
        description: "Computed dashboard statistics",
        properties: {
          totalPrograms: {
            type: "integer",
            description: "Total number of programs",
            example: 9
          },
          activeStudies: {
            type: "integer",
            description: "Number of active studies across all programs",
            example: 15
          },
          averageEnrollment: {
            type: "number",
            format: "float",
            description: "Average enrollment percentage across all studies",
            example: 62.4
          },
          completedMilestones: {
            type: "integer",
            description: "Number of completed milestones",
            example: 23
          },
          upcomingMilestones: {
            type: "integer",
            description: "Number of upcoming milestones (due within 30 days)",
            example: 8
          },
          criticalAlerts: {
            type: "integer",
            description: "Number of critical/high-priority alerts",
            example: 2
          },
          pendingApprovals: {
            type: "integer",
            description: "Number of programs pending approval",
            example: 1
          },
          budgetUtilization: {
            type: "integer",
            description: "Overall budget utilization percentage",
            example: 73
          },
          avgTimeToCompletion: {
            type: "integer",
            description: "Average time to program completion in days",
            example: 365
          },
        },
      },
    },
    securitySchemes: {
      AdminKey: {
        type: "apiKey",
        in: "body",
        name: "adminKey",
        description: "Admin authentication key required for feature flag modifications"
      },
    },
  },
};
