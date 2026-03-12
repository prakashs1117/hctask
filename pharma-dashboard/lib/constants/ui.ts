export const METRIC_THEMES = {
  studies: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    icon: 'text-blue-600'
  },
  enrolled: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    icon: 'text-green-600'
  },
  target: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    icon: 'text-amber-600'
  },
  progress: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    icon: 'text-purple-600'
  },
} as const;

export type MetricTheme = keyof typeof METRIC_THEMES;

export const MILESTONE_STATUS_COLORS = {
  completed: 'bg-green-500',
  pending: 'bg-amber-500',
} as const;