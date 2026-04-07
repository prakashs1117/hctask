import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FeatureFlagsProvider } from '@/lib/contexts/feature-flags-context';
import { ThemeProvider } from 'next-themes';

// Mock feature flags for testing
const mockFeatureFlags = {
  enableDashboard: true,
  enablePrograms: true,
  enableIAM: true,
  enableAlerts: true,
  enableRealTimeUpdates: false,
  enableAdvancedFiltering: true,
  enableExperimentalFeatures: false,
};

// Mock Zustand stores
jest.mock('@/lib/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    role: 'Manager',
    currentUser: {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'Manager',
      assignedPrograms: [],
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    hasPermission: jest.fn((permission: string) => {
      // Grant all permissions for Manager role in tests
      const managerPermissions = [
        'view_programs', 'create_programs', 'edit_programs', 'delete_programs',
        'manage_users', 'view_alerts', 'set_alerts'
      ];
      return managerPermissions.includes(permission);
    }),
    setRole: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  })),
}));

jest.mock('@/lib/stores/uiStore', () => ({
  useUIStore: jest.fn(() => ({
    sidebarCollapsed: false,
    toggleSidebar: jest.fn(),
    setSidebarCollapsed: jest.fn(),
    theme: 'light',
    setTheme: jest.fn(),
  })),
}));

jest.mock('@/lib/stores/filterStore', () => ({
  useFilterStore: jest.fn(() => ({
    search: '',
    phase: 'All',
    therapeuticArea: 'All',
    status: 'All',
    setSearch: jest.fn(),
    setPhase: jest.fn(),
    setTherapeuticArea: jest.fn(),
    setStatus: jest.fn(),
    resetFilters: jest.fn(),
  })),
}));

// Mock i18n
jest.mock('@/lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
    setLocale: jest.fn(),
  }),
}));

// Mock alerts hook
jest.mock('@/lib/hooks/useAlerts', () => ({
  useActiveAlertCount: () => 5,
  useAlerts: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}));

// Mock RTK Query hooks
jest.mock('@/lib/store/api/apiSlice', () => ({
  useGetProgramsQuery: jest.fn(() => ({
    data: { data: [], success: true },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useGetProgramByIdQuery: jest.fn(() => ({
    data: { data: null, success: true },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useGetDashboardStatsQuery: jest.fn(() => ({
    data: { data: {}, success: true },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useCreateProgramMutation: jest.fn(() => {
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: { success: true } })
    });
    return [mockMutation, { isLoading: false, error: null }];
  }),
  useUpdateProgramMutation: jest.fn(() => {
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: { success: true } })
    });
    return [mockMutation, { isLoading: false, error: null }];
  }),
  useDeleteProgramMutation: jest.fn(() => {
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: { success: true } })
    });
    return [mockMutation, { isLoading: false, error: null }];
  }),
  apiSlice: {
    reducer: (state = {}) => state,
    middleware: [] as any,
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  }),
}));

// Create a simple test store
function createTestStore() {
  return configureStore({
    reducer: {
      // Simple mock reducers for testing
      api: (state = {}) => state,
      programs: (state = {}) => state,
      dashboard: (state = {}) => state,
      ui: (state = {}) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'persist/PERSIST',
            'persist/REHYDRATE',
            'api/executeQuery/pending',
            'api/executeQuery/fulfilled',
            'api/executeQuery/rejected',
            'api/executeMutation/pending',
            'api/executeMutation/fulfilled',
            'api/executeMutation/rejected',
          ],
          ignoredPaths: ['api.queries', 'api.mutations'],
        },
      }),
    devTools: false,
  });
}

// All-in-one test wrapper component
interface AllTheProvidersProps {
  children: React.ReactNode;
  initialState?: any;
}

// Mock the FeatureFlagsProvider for tests to avoid API calls
jest.mock('@/lib/contexts/feature-flags-context', () => {
  const mockContext = {
    flags: {
      enableDashboard: true,
      enablePrograms: true,
      enableIAM: true,
      enableAlerts: true,
      enableRealTimeUpdates: false,
      enableAdvancedFiltering: true,
      enableExperimentalFeatures: false,
    },
    isFeatureEnabled: jest.fn((flag: string) => mockContext.flags[flag as keyof typeof mockContext.flags] ?? false),
    updateFlags: jest.fn(),
    isLoading: false,
    error: null,
  };

  return {
    FeatureFlagsProvider: ({ children }: { children: React.ReactNode }) => children,
    useFeatureFlags: () => mockContext,
    FeatureFlagsContext: React.createContext(mockContext),
  };
});

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  initialState
}) => {
  const store = createTestStore();

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </Provider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialState?: any;
  }
) =>
  render(ui, {
    wrapper: (props) => <AllTheProviders {...props} initialState={options?.initialState} />,
    ...options
  });

// Re-export mock data
export {
  mockProgram,
  mockUser,
  mockAlert,
  mockPrograms,
  mockDashboardStats,
} from './mocks/data';

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { mockFeatureFlags, createTestStore };