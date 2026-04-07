import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Program, Alert, User } from '@/types';

// Define API response types
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

interface DashboardStats {
  totalPrograms: number;
  activeStudies: number;
  completedMilestones: number;
  upcomingMilestones: number;
  criticalAlerts: number;
  pendingApprovals: number;
  budgetUtilization: number;
  avgTimeToCompletion: number;
}

// Base API slice with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    // Add headers, authentication, etc.
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  // Define tag types for cache management
  tagTypes: ['Program', 'Alert', 'User', 'Dashboard'],
  endpoints: (builder) => ({
    // Programs endpoints
    getPrograms: builder.query<ApiResponse<Program[]>, void>({
      query: () => '/programs',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Program' as const, id })),
              { type: 'Program', id: 'LIST' },
            ]
          : [{ type: 'Program', id: 'LIST' }],
      // Transform response to handle date conversion
      transformResponse: (response: ApiResponse<any[]>) => ({
        ...response,
        data: response.data.map((program) => ({
          ...program,
          createdAt: new Date(program.createdAt),
          updatedAt: new Date(program.updatedAt),
          studies: program.studies?.map((study: any) => ({
            ...study,
            startDate: new Date(study.startDate),
            estimatedEndDate: new Date(study.estimatedEndDate),
          })),
          milestones: program.milestones?.map((milestone: any) => ({
            ...milestone,
            dueDate: new Date(milestone.dueDate),
            completedDate: milestone.completedDate ? new Date(milestone.completedDate) : undefined,
          })),
        })),
      }),
      // Keep data fresh for 5 minutes
      keepUnusedDataFor: 5 * 60, // 5 minutes
    }),

    getProgramById: builder.query<ApiResponse<Program>, string>({
      query: (id) => `/programs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Program', id }],
      // Transform single program response
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          studies: response.data.studies?.map((study: any) => ({
            ...study,
            startDate: new Date(study.startDate),
            estimatedEndDate: new Date(study.estimatedEndDate),
          })),
          milestones: response.data.milestones?.map((milestone: any) => ({
            ...milestone,
            dueDate: new Date(milestone.dueDate),
            completedDate: milestone.completedDate ? new Date(milestone.completedDate) : undefined,
          })),
        },
      }),
    }),

    // Dashboard stats endpoint
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/dashboard/stats',
      providesTags: [{ type: 'Dashboard', id: 'STATS' }],
      // Note: pollingInterval should be set when using the hook
    }),

    // Alerts endpoints
    getAlerts: builder.query<ApiResponse<Alert[]>, void>({
      query: () => '/alerts',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Alert' as const, id })),
              { type: 'Alert', id: 'LIST' },
            ]
          : [{ type: 'Alert', id: 'LIST' }],
      keepUnusedDataFor: 2 * 60, // 2 minutes for alerts (more frequent updates)
    }),

    // Users endpoints
    getUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => '/users',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
      keepUnusedDataFor: 10 * 60, // 10 minutes for users (less frequent updates)
    }),

    // Mutation endpoints
    updateProgram: builder.mutation<ApiResponse<Program>, { id: string; data: Partial<Program> }>({
      query: ({ id, data }) => ({
        url: `/programs/${id}`,
        method: 'PUT',
        body: data,
      }),
      // Optimistic update
      onQueryStarted: async ({ id, data }, { dispatch, queryFulfilled }) => {
        // Optimistically update the program in cache
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPrograms', undefined, (draft) => {
            const program = draft.data.find((p) => p.id === id);
            if (program) {
              Object.assign(program, data);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Program', id },
        { type: 'Program', id: 'LIST' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    createProgram: builder.mutation<ApiResponse<Program>, Partial<Program>>({
      query: (data) => ({
        url: '/programs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Program', id: 'LIST' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),

    deleteProgram: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/programs/${id}`,
        method: 'DELETE',
      }),
      // Optimistic update
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPrograms', undefined, (draft) => {
            draft.data = draft.data.filter((p) => p.id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Program', id },
        { type: 'Program', id: 'LIST' },
        { type: 'Dashboard', id: 'STATS' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useGetDashboardStatsQuery,
  useGetAlertsQuery,
  useGetUsersQuery,
  useUpdateProgramMutation,
  useCreateProgramMutation,
  useDeleteProgramMutation,
  // Lazy query hooks for manual triggering
  useLazyGetProgramsQuery,
  useLazyGetProgramByIdQuery,
} = apiSlice;