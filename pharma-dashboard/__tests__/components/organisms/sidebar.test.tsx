import React from 'react';
import { render, screen } from '../../test-utils';
import { Sidebar } from '../../../components/organisms/sidebar';

// Mocks are already defined in test-utils

describe('Sidebar', () => {
  it('should render app name', () => {
    render(<Sidebar />);
    expect(screen.getByText('common.appName')).toBeInTheDocument();
  });

  it('should render navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('navigation.dashboard')).toBeInTheDocument();
    expect(screen.getByText('navigation.programs')).toBeInTheDocument();
  });

  it('should render role selector', () => {
    render(<Sidebar />);
    expect(screen.getByText('common.viewAsRole')).toBeInTheDocument();
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
    // Look for alert count badge - it might be in a badge element
    const alertBadge = screen.queryByText('5'); // Our mock returns 5 alerts
    expect(alertBadge).toBeInTheDocument();
  });
});
