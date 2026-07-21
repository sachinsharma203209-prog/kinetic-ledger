"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  ({ title, description, children, className, actions }, ref) => (
    <Card ref={ref} className={cn("flex flex-col", className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent className="flex-1">{children}</CardContent>
    </Card>
  )
);
ChartCard.displayName = "ChartCard";
