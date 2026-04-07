import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Page header component props
 */
interface PageHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Reusable page header component
 * @param props - Page header properties
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h1>
          {description && (
            typeof description === 'string' ? (
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">{description}</p>
            ) : (
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">{description}</div>
            )
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
