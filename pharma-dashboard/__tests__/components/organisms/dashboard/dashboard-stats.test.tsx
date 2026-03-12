import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from '../../../../components/organisms/dashboard/dashboard-stats';

jest.mock('../../../../lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'dashboard.stats.totalPrograms': 'Total Programs',
        'dashboard.stats.totalProgramsDesc': 'Active research programs',
        'dashboard.stats.activeStudies': 'Active Studies',
        'dashboard.stats.activeStudiesDesc': 'Currently running',
        'dashboard.stats.avgEnrollment': 'Avg Enrollment',
        'dashboard.stats.avgEnrollmentDesc': 'Across all studies',
        'dashboard.stats.activeAlerts': 'Active Alerts',
        'dashboard.stats.activeAlertsDesc': 'Requiring attention',
      };
      return t[key] || key;
    },
    translations: {},
  }),
  TRANSLATION_KEYS: {
    DASHBOARD: {
      STATS: {
        TOTAL_PROGRAMS: 'dashboard.stats.totalPrograms',
        TOTAL_PROGRAMS_DESC: 'dashboard.stats.totalProgramsDesc',
        ACTIVE_STUDIES: 'dashboard.stats.activeStudies',
        ACTIVE_STUDIES_DESC: 'dashboard.stats.activeStudiesDesc',
        AVG_ENROLLMENT: 'dashboard.stats.avgEnrollment',
        AVG_ENROLLMENT_DESC: 'dashboard.stats.avgEnrollmentDesc',
        ACTIVE_ALERTS: 'dashboard.stats.activeAlerts',
        ACTIVE_ALERTS_DESC: 'dashboard.stats.activeAlertsDesc',
      },
    },
  },
}));

describe('DashboardStats', () => {
  it('should render stat cards with values', () => {
    const stats = {
      totalPrograms: 10,
      activeStudies: 25,
      averageEnrollment: 75,
      activeAlerts: 3,
      programsByPhase: {} as Record<string, number>,
      programsByArea: {} as Record<string, number>,
    };
    render(<DashboardStats stats={stats} />);
    expect(screen.getByText('Total Programs')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Active Studies')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should handle undefined stats', () => {
    render(<DashboardStats stats={undefined} />);
    expect(screen.getByText('Total Programs')).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2);
  });
});
