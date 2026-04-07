import { ReactNode } from 'react';
import { LucideIcon, Search } from 'lucide-react';
import { Button } from "@/components/atoms/button";
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string | ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  action?: ReactNode;
}

const sizeClasses = {
  sm: {
    container: 'py-6',
    icon: 'w-10 h-10 mb-2',
    iconSize: 'h-4 w-4',
    text: 'text-xs'
  },
  md: {
    container: 'py-8',
    icon: 'w-12 h-12 mb-3',
    iconSize: 'h-5 w-5',
    text: 'text-sm'
  },
  lg: {
    container: 'py-16',
    icon: 'w-24 h-24 mb-4',
    iconSize: 'h-8 w-8',
    text: 'text-base'
  }
};

export function EmptyState({
  icon: Icon = Search,
  title,
  message,
  onClear,
  clearLabel = "Clear all filters",
  className,
  size = 'lg',
  action
}: EmptyStateProps) {
  const sizeStyle = sizeClasses[size];

  return (
    <div className={cn('text-center', sizeStyle.container, className)}>
      <div className={cn(
        'mx-auto flex items-center justify-center rounded-full bg-muted',
        sizeStyle.icon
      )}>
        <Icon className={cn('text-muted-foreground', sizeStyle.iconSize)} />
      </div>
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <div className={cn('text-muted-foreground leading-snug', title ? 'mb-4' : '', sizeStyle.text)}>{message}</div>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
      {onClear && (
        <Button variant="outline" onClick={onClear} className="mt-4">
          {clearLabel}
        </Button>
      )}
    </div>
  );
}
