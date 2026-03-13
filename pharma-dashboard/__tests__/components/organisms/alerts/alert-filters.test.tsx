import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertFilters } from '../../../../components/organisms/alerts/alert-filters';

jest.mock('../../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'alerts.alertStatus': 'Alert Status',
        'alerts.notificationChannel': 'Notification Channel',
        'alerts.statuses.all': 'All Statuses',
        'alerts.statuses.active': 'Active',
        'alerts.statuses.overdue': 'Overdue',
        'alerts.statuses.completed': 'Completed',
        'alerts.statuses.dismissed': 'Dismissed',
        'alerts.channels.all': 'All Channels',
        'alerts.channels.email': 'Email',
        'alerts.channels.sms': 'SMS',
        'alerts.channels.webPush': 'Web Push',
        'alerts.channels.slack': 'Slack',
        'filters.activeFilters': 'Active Filters',
        'filters.filterSettings': 'Filter Settings',
        'filters.status': 'Status',
        'filters.channel': 'Channel',
        'filters.quickFilters': 'Quick Filters',
        'alerts.quickFilters.overdueOnly': 'Overdue Only',
        'alerts.quickFilters.activeOnly': 'Active Only',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

describe('AlertFilters', () => {
  const defaultProps = {
    statusFilter: 'All',
    channelFilter: 'All',
    setStatusFilter: jest.fn(),
    setChannelFilter: jest.fn(),
    searchQuery: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render status and channel filter labels', () => {
    render(<AlertFilters {...defaultProps} />);
    expect(screen.getByText('Alert Status')).toBeInTheDocument();
    expect(screen.getByText('Notification Channel')).toBeInTheDocument();
  });

  it('should render filter settings panel', () => {
    render(<AlertFilters {...defaultProps} />);
    expect(screen.getByText('Filter Settings')).toBeInTheDocument();
  });

  it('should render quick filter buttons', () => {
    render(<AlertFilters {...defaultProps} />);
    expect(screen.getByText('Overdue Only')).toBeInTheDocument();
    expect(screen.getByText('Active Only')).toBeInTheDocument();
  });

  it('should call setStatusFilter when status select changes', () => {
    render(<AlertFilters {...defaultProps} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'Active' } });
    expect(defaultProps.setStatusFilter).toHaveBeenCalledWith('Active');
  });

  it('should call setChannelFilter when channel select changes', () => {
    render(<AlertFilters {...defaultProps} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'Email' } });
    expect(defaultProps.setChannelFilter).toHaveBeenCalledWith('Email');
  });

  it('should show active filters when status is not All', () => {
    render(<AlertFilters {...defaultProps} statusFilter="Active" />);
    expect(screen.getByText('Active Filters')).toBeInTheDocument();
  });

  it('should show active filters when channel is not All', () => {
    render(<AlertFilters {...defaultProps} channelFilter="Email" />);
    expect(screen.getByText('Active Filters')).toBeInTheDocument();
  });

  it('should not show active filters when all defaults', () => {
    render(<AlertFilters {...defaultProps} />);
    expect(screen.queryByText('Active Filters')).not.toBeInTheDocument();
  });

  it('should call setStatusFilter on quick filter click', () => {
    render(<AlertFilters {...defaultProps} />);
    fireEvent.click(screen.getByText('Overdue Only'));
    expect(defaultProps.setStatusFilter).toHaveBeenCalledWith('Overdue');
  });

  it('should call setStatusFilter on Active Only click', () => {
    render(<AlertFilters {...defaultProps} />);
    fireEvent.click(screen.getByText('Active Only'));
    expect(defaultProps.setStatusFilter).toHaveBeenCalledWith('Active');
  });

  it('should clear status filter when X is clicked', () => {
    const { container } = render(<AlertFilters {...defaultProps} statusFilter="Active" />);
    const xIcons = container.querySelectorAll('.cursor-pointer');
    fireEvent.click(xIcons[0]);
    expect(defaultProps.setStatusFilter).toHaveBeenCalledWith('All');
  });
});
