import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertsPage from '../../../app/alerts/page';

jest.mock('../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'alerts.title': 'Alerts',
        'alerts.subtitle': 'Manage notifications',
        'alerts.activeAlerts': 'Active Alerts',
        'alerts.overdue': 'Overdue',
        'alerts.nextSevenDays': 'Next 7 Days',
        'alerts.searchAlerts': 'Search alerts...',
        'common.filters': 'Filters',
        'common.clearAll': 'Clear All',
        'common.status': 'Status',
        'common.actions': 'Actions',
        'common.snooze': 'Snooze',
        'common.dismiss': 'Dismiss',
        'alerts.program': 'Program',
        'alerts.study': 'Study',
        'alerts.deadline': 'Deadline',
        'alerts.channel': 'Channel',
        'alerts.alertFilters': 'Alert Filters',
        'alerts.loadingAlerts': 'Loading alerts...',
        'alerts.xAlerts': '{count} alerts',
        'alerts.noAlertsConfigured': 'No alerts configured',
        'alerts.noAlertsConfiguredDesc': 'Create an alert to get started',
        'alerts.noAlertsMatch': 'No alerts match',
        'alerts.noAlertsMatchDesc': 'Try adjusting your filters',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

jest.mock('../../../lib/hooks/useAlerts', () => ({
  useAlerts: () => ({
    data: [
      {
        id: 'ALT-001',
        program: 'Program Alpha',
        study: 'Study 1',
        deadline: '2026-04-01',
        channel: ['Email'],
        status: 'Active',
        recurring: 'One-time',
        notifyBefore: [7],
        createdAt: '2024-01-01',
      },
      {
        id: 'ALT-002',
        program: 'Program Beta',
        study: 'Study 2',
        deadline: '2024-01-01',
        channel: ['SMS'],
        status: 'Overdue',
        recurring: 'Weekly',
        notifyBefore: [3],
        createdAt: '2024-01-01',
      },
    ],
    isLoading: false,
  }),
  useActiveAlertCount: () => 2,
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn().mockReturnValue({
    invalidateQueries: jest.fn(),
  }),
  useMutation: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('../../../lib/stores/authStore', () => ({
  useAuthStore: () => ({
    hasPermission: (perm: string) => perm === 'set_alerts',
  }),
}));

jest.mock('../../../components/organisms/alerts/create-alert-dialog', () => ({
  CreateAlertDialog: () => <div data-testid="create-alert">Create Alert</div>,
}));

jest.mock('../../../components/organisms/filter-sidebar', () => ({
  FilterSidebar: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="filter-sidebar">{children}</div>
  ),
}));

jest.mock('../../../components/organisms/alerts/alert-filters', () => ({
  AlertFilters: () => <div data-testid="alert-filters">Alert Filters</div>,
}));

describe('AlertsPage', () => {
  it('should render page header', () => {
    render(<AlertsPage />);
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('should render stat cards', () => {
    render(<AlertsPage />);
    const activeAlertsElements = screen.getAllByText('Active Alerts');
    expect(activeAlertsElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Next 7 Days')).toBeInTheDocument();
  });

  it('should render alert table with program names', () => {
    render(<AlertsPage />);
    expect(screen.getByText('Program Alpha')).toBeInTheDocument();
    expect(screen.getByText('Program Beta')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<AlertsPage />);
    expect(screen.getByPlaceholderText('Search alerts...')).toBeInTheDocument();
  });

  it('should render filter sidebar', () => {
    render(<AlertsPage />);
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
  });

  it('should show action buttons when user has permission', () => {
    render(<AlertsPage />);
    const snoozeButtons = screen.getAllByText('Snooze');
    expect(snoozeButtons.length).toBeGreaterThan(0);
  });
});
