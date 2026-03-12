import Link from 'next/link';
import { Button } from '@/components/atoms/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotFoundStateProps {
  entity: string;
  backUrl: string;
  backLabel: string;
  className?: string;
}

export function NotFoundState({
  entity,
  backUrl,
  backLabel,
  className
}: NotFoundStateProps) {
  return (
    <div className={cn('flex h-96 flex-col items-center justify-center gap-3', className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-5 w-5" />
        {entity} not found
      </div>
      <Link href={backUrl}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      </Link>
    </div>
  );
}