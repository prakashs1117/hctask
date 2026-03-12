import { BarChart3, Users, Target, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/components/molecules/metric-card';
import { formatNumber } from '@/lib/utils/formatters';
import { t, TRANSLATION_KEYS } from '@/lib/i18n';

interface MetricsGridProps {
  studiesCount: number;
  totalEnrollment: number;
  totalTarget: number;
  enrollmentPercentage: number;
}

export function MetricsGrid({
  studiesCount,
  totalEnrollment,
  totalTarget,
  enrollmentPercentage
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <MetricCard
        icon={BarChart3}
        label={t(TRANSLATION_KEYS.COMMON.STUDIES)}
        value={studiesCount}
        theme="studies"
      />
      <MetricCard
        icon={Users}
        label={t(TRANSLATION_KEYS.COMMON.ENROLLED)}
        value={formatNumber(totalEnrollment)}
        theme="enrolled"
      />
      <MetricCard
        icon={Target}
        label={t(TRANSLATION_KEYS.COMMON.TARGET)}
        value={formatNumber(totalTarget)}
        theme="target"
      />
      <MetricCard
        icon={TrendingUp}
        label={t(TRANSLATION_KEYS.COMMON.PROGRESS)}
        value={`${enrollmentPercentage}%`}
        theme="progress"
      />
    </div>
  );
}