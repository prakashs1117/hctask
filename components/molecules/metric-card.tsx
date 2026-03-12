import { Card } from '@/components/atoms/card';
import { LucideIcon } from 'lucide-react';
import { METRIC_THEMES, type MetricTheme } from '@/lib/constants/ui';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  theme: MetricTheme;
  className?: string;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  theme,
  className
}: MetricCardProps) {
  const themeStyles = METRIC_THEMES[theme];

  return (
    <Card className={cn('p-3', className)}>
      <div className="flex items-center gap-2">
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded',
          themeStyles.bg,
          themeStyles.text
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}