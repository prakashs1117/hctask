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
    "/api/programs": {
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
                  type: "array",
                  items: { $ref: "#/components/schemas/Program" },
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
    "/api/programs/{id}": {
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
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List all users",
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
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
    "/api/users/{id}": {
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
    "/api/alerts": {
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
                  type: "array",
                  items: { $ref: "#/components/schemas/Alert" },
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
    "/api/alerts/{id}": {
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
    },
  },
};
