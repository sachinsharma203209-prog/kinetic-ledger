"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChartCard } from "@/components/ui/ChartCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAnalytics } from "@/hooks/useQueries";
import { formatCurrency } from "@/lib/utils";
import { Users, UserCheck, DollarSign, TrendingUp, CheckCircle, Clock, CreditCard } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading || !analytics) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-on-surface">Analytics Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard icon={<Users />} label="Total Users" value={analytics.totalUsers.toLocaleString()} trend={{ value: analytics.monthlyGrowth, direction: "up" }} />
          <StatsCard icon={<UserCheck />} label="Active Users" value={analytics.activeUsers.toLocaleString()} />
          <StatsCard icon={<DollarSign />} label="Total Revenue" value={formatCurrency(analytics.totalRevenue)} />
          <StatsCard icon={<TrendingUp />} label="Commission" value={formatCurrency(analytics.commissionEarned)} />
          <StatsCard icon={<CheckCircle />} label="Tasks Done" value={analytics.tasksCompleted.toLocaleString()} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="User Growth" description="New users over the last 6 months">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analytics.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenue vs Commission" description="Monthly breakdown">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commission" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Task Completion" description="Completed vs rejected tasks">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.taskCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="completed" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
              <Area type="monotone" dataKey="rejected" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.pendingApprovals}</p>
              <p className="text-sm text-on-surface-variant">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pending Withdrawals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.pendingWithdrawals}</p>
              <p className="text-sm text-on-surface-variant">{formatCurrency(analytics.totalVolume)} total volume</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
