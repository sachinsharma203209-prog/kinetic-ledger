"use client";

import { useState, useMemo } from "react";
import { Users, UserCheck, TrendingUp, Copy, Check } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchBox } from "@/components/ui/SearchBox";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { useReferrals } from "@/hooks/useQueries";
import { formatCurrency, formatDate, copyToClipboard } from "@/lib/utils";

const statusBadge: Record<string, "success" | "error" | "warning"> = {
  active: "success",
  inactive: "error",
  pending: "warning",
};

export default function ReferralsPage() {
  const { data: referrals = [], isLoading } = useReferrals();
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const active = referrals.filter((r) => r.status === "active").length;
    const totalYield = referrals.reduce((sum, r) => sum + r.yield, 0);
    return { total: referrals.length, active, totalYield };
  }, [referrals]);

  const filtered = useMemo(() => {
    if (!search) return referrals;
    const q = search.toLowerCase();
    return referrals.filter(
      (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    );
  }, [referrals, search]);

  const referralCode = referrals[0]?.id ? `REF-${referrals[0].id.slice(0, 8).toUpperCase()}` : "N/A";
  const referralLink = `https://kineticledger.com/join/${referralCode}`;

  const handleCopy = async () => {
    await copyToClipboard(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-64" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Users />} label="Total Referrals" value={stats.total} />
          <StatsCard icon={<UserCheck />} label="Active Referrals" value={stats.active} />
          <StatsCard icon={<TrendingUp />} label="Total Yield" value={formatCurrency(stats.totalYield)} trend={{ value: 8, direction: "up" }} />
          <Card className="p-6">
            <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Referral Code</span>
            <div className="mt-2 flex items-center gap-2">
              <code className="rounded bg-surface-container px-3 py-1.5 text-sm font-semibold text-primary">{referralCode}</code>
              <button onClick={handleCopy} className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container-low transition-colors">
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low/30 p-3">
              <code className="flex-1 truncate text-sm text-on-surface">{referralLink}</code>
              <button onClick={handleCopy} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-on-primary hover:bg-primary/90 transition-colors">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Your Network</CardTitle>
            <SearchBox onSearch={setSearch} placeholder="Search referrals..." className="w-56" />
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <EmptyState icon={<Users />} title="No referrals yet" description="Share your referral link to start earning bonuses." />
            ) : (
              <>
                <Table className="hidden md:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Yield</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium text-sm">{r.name}</TableCell>
                        <TableCell className="text-sm text-on-surface-variant">{r.email}</TableCell>
                        <TableCell className="text-sm">{formatDate(r.joinedDate)}</TableCell>
                        <TableCell><Badge variant={statusBadge[r.status]}>{r.status}</Badge></TableCell>
                        <TableCell className="text-sm">{r.tasksCompleted}</TableCell>
                        <TableCell className="text-sm font-medium text-emerald-600">{formatCurrency(r.yield)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="space-y-3 md:hidden">
                  {filtered.map((r) => (
                    <div key={r.id} className="rounded-lg border border-outline-variant/40 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-on-surface">{r.name}</span>
                        <Badge variant={statusBadge[r.status]}>{r.status}</Badge>
                      </div>
                      <p className="text-xs text-on-surface-variant">{r.email}</p>
                      <div className="flex items-center justify-between text-xs text-on-surface-variant">
                        <span>Joined {formatDate(r.joinedDate)}</span>
                        <span>{r.tasksCompleted} tasks · <span className="font-medium text-emerald-600">{formatCurrency(r.yield)}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
