"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { useWithdrawalRequests } from "@/hooks/useQueries";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Clock, Loader2, CheckCircle, DollarSign, CreditCard, Building2, Bitcoin } from "lucide-react";

type Filter = "all" | "pending" | "processing" | "completed" | "rejected";

const statusBadge: Record<string, "warning" | "info" | "success" | "error" | "default"> = {
  pending: "warning",
  processing: "info",
  completed: "success",
  rejected: "error",
};

const methodIcon: Record<string, React.ReactNode> = {
  paypal: <CreditCard className="h-4 w-4" />,
  bank_transfer: <Building2 className="h-4 w-4" />,
  crypto: <Bitcoin className="h-4 w-4" />,
};

export default function WithdrawalsPage() {
  const { data: withdrawals, isLoading } = useWithdrawalRequests();
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmModal, setConfirmModal] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const filtered = useMemo(() => {
    if (!withdrawals) return [];
    if (filter === "all") return withdrawals;
    return withdrawals.filter((w) => w.status === filter);
  }, [withdrawals, filter]);

  const stats = useMemo(() => {
    if (!withdrawals) return { pending: 0, processing: 0, completed: 0, volume: 0 };
    return {
      pending: withdrawals.filter((w) => w.status === "pending").length,
      processing: withdrawals.filter((w) => w.status === "processing").length,
      completed: withdrawals.filter((w) => w.status === "completed").length,
      volume: withdrawals.reduce((sum, w) => sum + w.amount, 0),
    };
  }, [withdrawals]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-on-surface">Withdrawal Requests</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Clock />} label="Pending" value={stats.pending} />
          <StatsCard icon={<Loader2 />} label="Processing" value={stats.processing} />
          <StatsCard icon={<CheckCircle />} label="Completed" value={stats.completed} />
          <StatsCard icon={<DollarSign />} label="Total Volume" value={formatCurrency(stats.volume)} />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "processing", "completed", "rejected"] as Filter[]).map((f) => (
            <Button key={f} variant={filter === f ? "primary" : "secondary"} size="sm" onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<DollarSign />} title="No withdrawals found" description="No requests match the current filter." />
        ) : (
          <>
            <div className="hidden md:block">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Processed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar src={w.userAvatar} initials={w.userName.charAt(0)} size="sm" />
                            <div>
                              <p className="font-medium">{w.userName}</p>
                              <p className="text-xs text-on-surface-variant">{w.userEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(w.amount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {methodIcon[w.method]}
                            <span className="capitalize">{w.method.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={statusBadge[w.status]}>{w.status}</Badge></TableCell>
                        <TableCell>{formatDate(w.requestDate)}</TableCell>
                        <TableCell>{w.processedDate ? formatDate(w.processedDate) : "—"}</TableCell>
                        <TableCell className="text-right">
                          {w.status === "pending" && (
                            <div className="flex justify-end gap-1">
                              <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setConfirmModal({ id: w.id, action: "approve" })}>Approve</Button>
                              <Button variant="destructive" size="sm" onClick={() => setConfirmModal({ id: w.id, action: "reject" })}>Reject</Button>
                            </div>
                          )}
                          {w.status === "processing" && (
                            <Button variant="secondary" size="sm" onClick={() => setConfirmModal({ id: w.id, action: "approve" })}>Complete</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <div className="grid gap-4 md:hidden">
              {filtered.map((w) => (
                <Card key={w.id}>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={w.userAvatar} initials={w.userName.charAt(0)} />
                      <div className="flex-1">
                        <p className="font-medium">{w.userName}</p>
                        <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                          {methodIcon[w.method]}
                          <span className="capitalize">{w.method.replace("_", " ")}</span>
                        </div>
                      </div>
                      <Badge variant={statusBadge[w.status]}>{w.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{formatCurrency(w.amount)}</span>
                      <span className="text-on-surface-variant">{formatDate(w.requestDate)}</span>
                    </div>
                    {w.status === "pending" && (
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setConfirmModal({ id: w.id, action: "approve" })}>Approve</Button>
                        <Button variant="destructive" size="sm" className="flex-1" onClick={() => setConfirmModal({ id: w.id, action: "reject" })}>Reject</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Modal isOpen={!!confirmModal} onClose={() => setConfirmModal(null)} title={confirmModal?.action === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"} size="sm">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "14px", color: "#3c4a42", margin: 0 }}>
              Are you sure you want to {confirmModal?.action} this withdrawal request? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
              <Button variant="secondary" size="md" className="flex-1" onClick={() => setConfirmModal(null)}>Cancel</Button>
              <Button variant={confirmModal?.action === "approve" ? "primary" : "destructive"} size="md" className="flex-1">
                {confirmModal?.action === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
