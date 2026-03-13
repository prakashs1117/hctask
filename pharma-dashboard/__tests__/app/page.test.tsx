import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../../app/page';

jest.mock('../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'programs.searchPrograms': 'Search programs...',
        'common.filters': 'Filters',
        'common.clearAll': 'Clear All',
        'dashboard.portfolioFilters': 'Portfolio Filters',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

jest.mock('../../lib/hooks/usePrograms', () => ({
  usePrograms: () => ({
    data: [
      { id: 'PRG-001', name: 'Program 1', phase: 'Phase III', therapeuticArea: 'Oncology', status: 'Active', description: 'Desc', manager: 'John' },
    ],
    isLoading: false,
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn().mockReturnValue({
    data: { totalPrograms: 5, activeStudies: 10, avgEnrollment: 75, activeAlerts: 3 },
    isLoading: false,
  }),
}));

jest.mock('../../lib/stores/filterStore', () => ({
  useFilterStore: () => ({
    search: '',
    phase: 'All',
    therapeuticArea: 'All',
    status: 'All',
    setFilters: jest.fn(),
    resetFilters: jest.fn(),
  }),
}));

jest.mock('../../lib/hooks/useFilteredPrograms', () => ({
  useFilteredPrograms: (programs: unknown[]) => programs || [],
}));

jest.mock('../../components/organisms/dashboard/dashboard-header', () => ({
  DashboardHeader: () => <div data-testid="dashboard-header">Dashboard Header</div>,
}));

jest.mock('../../components/organisms/dashboard/dashboard-stats', () => ({
  DashboardStats: () => <div data-testid="dashboard-stats">Dashboard Stats</div>,
}));

jest.mock('../../components/organisms/programs/program-filter-bar', () => ({
  ProgramFilterBar: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="program-filter-bar">{children}</div>
  ),
}));

jest.mock('../../components/organisms/programs/program-portfolio', () => ({
  ProgramPortfolio: () => <div data-testid="program-portfolio">Portfolio</div>,
}));

jest.mock('../../components/organisms/filter-sidebar', () => ({
  FilterSidebar: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="filter-sidebar">{children}</div>
  ),
}));

jest.mock('../../components/organisms/programs/program-filters', () => ({
  ProgramFilters: () => <div data-testid="program-filters">Filters</div>,
}));

jest.mock('../../components/molecules/view-mode-toggle', () => ({
  ViewModeToggle: () => <div data-testid="view-mode-toggle">Toggle</div>,
}));

describe('DashboardPage', () => {
  it('should render dashboard header', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
  });

  it('should render dashboard stats', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
  });

  it('should render program filter bar', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('program-filter-bar')).toBeInTheDocument();
  });

  it('should render program portfolio', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('program-portfolio')).toBeInTheDocument();
  });

  it('should render filter sidebar', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
  });

  it('should render view mode toggle', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
  });
});
