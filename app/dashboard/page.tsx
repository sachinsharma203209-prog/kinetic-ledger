"use client";

import Link from "next/link";
import {
  DollarSign,
  CheckSquare,
  Trophy,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDashboardStats } from "@/hooks/useQueries";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Task, Transaction } from "@/types";

function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const difficultyVariant = {
    easy: "success" as const,
    medium: "warning" as const,
    hard: "error" as const,
  };
  const labelVariant = {
    featured: "info" as const,
    popular: "success" as const,
    new: "info" as const,
    trending: "warning" as const,
  };

  return (
    <Card className="flex flex-col justify-between p-5 transition-shadow hover:shadow-md">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-on-surface line-clamp-2">
            {task.title}
          </h3>
          {task.label && (
            <Badge variant={labelVariant[task.label]}>{task.label}</Badge>
          )}
        </div>
        <p className="mb-3 text-xs text-on-surface-variant line-clamp-2">
          {task.description}
        </p>
        <div className="mb-3 flex items-center gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {task.estimatedTime}
          </span>
          <Badge variant={difficultyVariant[task.difficulty]}>
            {task.difficulty}
          </Badge>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant pt-3">
        <span className="text-base font-bold text-on-surface">
          {formatCurrency(task.reward)}
        </span>
        <Link href={`/dashboard/tasks/${task.id}`}>
          <Button size="sm">
            Start Task
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const typeIcons: Record<string, string> = {
    earning: "💰",
    withdrawal: "💸",
    referral_bonus: "🤝",
    deposit: "🏦",
    commission: "📊",
  };
  const statusVariant = {
    pending: "warning" as const,
    approved: "success" as const,
    completed: "success" as const,
    rejected: "error" as const,
  };

  return (
    <div className="flex items-center gap-3 border-b border-outline-variant py-3 last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container text-base">
        {typeIcons[tx.type] || "📋"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-on-surface">
          {tx.description}
        </p>
        <p className="text-xs text-on-surface-variant">
          {formatDate(tx.createdAt)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span
          className={`text-sm font-semibold ${
            tx.amount >= 0 ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {tx.amount >= 0 ? "+" : ""}
          {formatCurrency(tx.amount)}
        </span>
        <Badge variant={statusVariant[tx.status]}>{tx.status}</Badge>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <StatsLoadingSkeleton />
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-sm text-on-surface-variant">
            Welcome back! Here&apos;s your overview.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<DollarSign />}
            label="Current Balance"
            value={formatCurrency(stats.balance.current)}
            trend={{ value: 12.5, direction: "up" }}
          />
          <StatsCard
            icon={<CheckSquare />}
            label="Active Tasks"
            value={stats.activeTasks}
          />
          <StatsCard
            icon={<Trophy />}
            label="Completed Tasks"
            value={stats.completedTasks}
          />
          <StatsCard
            icon={<Clock className="text-amber-600" />}
            label="Pending Rewards"
            value={stats.pendingRewards}
          />
        </div>

        <ChartCard title="Weekly Earnings" description="Your earnings over the past 7 days">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyEarningData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), "Earnings"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#earningsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-on-surface">
              Available Tasks
            </h2>
            <Link href="/dashboard/tasks/create">
              <Button variant="secondary" size="sm">
                Create Task
              </Button>
            </Link>
          </div>
          {stats.availableTasks.length === 0 ? (
            <EmptyState
              icon={<CheckSquare />}
              title="No tasks available"
              description="Check back later for new tasks."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.availableTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentTransactions.length === 0 ? (
              <EmptyState
                icon={<DollarSign />}
                title="No transactions yet"
                description="Complete tasks to start earning."
              />
            ) : (
              <div>
                {stats.recentTransactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
