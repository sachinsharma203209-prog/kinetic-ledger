import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export interface StatsCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  sparkline?: React.ReactNode;
  className?: string;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ icon, label, value, trend, sparkline, className }, ref) => (
    <Card ref={ref} className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="text-primary [&_svg]:h-5 [&_svg]:w-5">
                {icon}
              </span>
            )}
            <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant label-caps">
              {label}
            </span>
          </div>
          <span className="text-title-md font-bold text-on-surface">
            {value}
          </span>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-600" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.direction === "up" ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        {sparkline && <div className="h-10 w-20">{sparkline}</div>}
      </div>
    </Card>
  )
);
StatsCard.displayName = "StatsCard";

export { StatsCard };
