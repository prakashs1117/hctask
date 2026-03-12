import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
};

export function LoadingSpinner({
  message = 'Loading...',
  className,
  size = 'md'
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex h-96 items-center justify-center', className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-primary border-t-transparent',
            sizeClasses[size]
          )}
        />
        {message}
      </div>
    </div>
  );
}