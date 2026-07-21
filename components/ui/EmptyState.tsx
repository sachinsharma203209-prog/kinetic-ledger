import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-on-surface-variant/40 [&_svg]:h-12 [&_svg]:w-12">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-on-surface-variant">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
