import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardHeader } from '../../../../components/organisms/dashboard/dashboard-header';

jest.mock('../../../../lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'dashboard.subtitle': 'Clinical Trial Dashboard',
        'dashboard.subtitleShort': 'Dashboard',
        'dashboard.lastUpdated': 'Last updated:',
        'dashboard.overview': 'Overview',
      };
      return t[key] || key;
    },
    translations: {},
  }),
  TRANSLATION_KEYS: {
    DASHBOARD: {
      SUBTITLE: 'dashboard.subtitle',
      SUBTITLE_SHORT: 'dashboard.subtitleShort',
      LAST_UPDATED: 'dashboard.lastUpdated',
      OVERVIEW: 'dashboard.overview',
    },
  },
}));

describe('DashboardHeader', () => {
  it('should render dashboard subtitle', () => {
    render(<DashboardHeader />);
    expect(screen.getByText('Clinical Trial Dashboard')).toBeInTheDocument();
  });

  it('should render overview badge', () => {
    render(<DashboardHeader />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });
});
