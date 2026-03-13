import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../../../components/organisms/sidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('../../../lib/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'common.appName': 'Pharma RCD',
        'common.appSubtitle': 'Clinical Dashboard',
        'common.viewAsRole': 'View as Role',
        'navigation.dashboard': 'Dashboard',
        'navigation.programs': 'Programs',
        'navigation.iam': 'IAM',
        'navigation.alerts': 'Alerts',
        'iam.roles.manager': 'Manager',
        'iam.roles.staff': 'Staff',
        'iam.roles.viewer': 'Viewer',
      };
      return t[key] || key;
    },
    locale: 'en',
    changeLocale: jest.fn(),
  }),
}));

jest.mock('../../../lib/stores/uiStore', () => ({
  useUIStore: () => ({
    sidebarCollapsed: false,
    toggleSidebar: jest.fn(),
  }),
}));

jest.mock('../../../lib/stores/authStore', () => ({
  useAuthStore: () => ({
    role: 'Manager',
    setRole: jest.fn(),
  }),
}));

jest.mock('../../../lib/hooks/useAlerts', () => ({
  useActiveAlertCount: () => 3,
}));

describe('Sidebar', () => {
  it('should render app name', () => {
    render(<Sidebar />);
    expect(screen.getByText('Pharma RCD')).toBeInTheDocument();
  });

  it('should render navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Programs')).toBeInTheDocument();
    expect(screen.getByText('IAM')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('should render role selector', () => {
    render(<Sidebar />);
    expect(screen.getByText('View as Role')).toBeInTheDocument();
  });

  it('should have navigation links', () => {
    render(<Sidebar />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/programs');
    expect(hrefs).toContain('/iam');
    expect(hrefs).toContain('/alerts');
  });

  it('should show alert count badge', () => {
    render(<Sidebar />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
