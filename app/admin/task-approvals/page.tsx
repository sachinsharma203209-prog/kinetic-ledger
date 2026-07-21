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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { useTaskApprovals } from "@/hooks/useQueries";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ClipboardCheck, Clock, CheckCircle, XCircle, Eye } from "lucide-react";

type Filter = "all" | "pending" | "approved" | "rejected";

const statusBadge: Record<string, "warning" | "success" | "error" | "default"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

export default function TaskApprovalsPage() {
  const { data: approvals, isLoading } = useTaskApprovals();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [proofModal, setProofModal] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!approvals) return [];
    if (filter === "all") return approvals;
    return approvals.filter((a) => a.status === filter);
  }, [approvals, filter]);

  const stats = useMemo(() => {
    if (!approvals) return { pending: 0, approved: 0, rejected: 0, rate: 0 };
    const pending = approvals.filter((a) => a.status === "pending").length;
    const approved = approvals.filter((a) => a.status === "approved").length;
    const rejected = approvals.filter((a) => a.status === "rejected").length;
    const total = approved + rejected;
    return { pending, approved, rejected, rate: total > 0 ? Math.round((approved / total) * 100) : 0 };
  }, [approvals]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((a) => a.id));
  };

  const proof = approvals?.find((a) => a.id === proofModal);

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
        <h1 className="text-2xl font-bold text-on-surface">Task Approvals</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Clock />} label="Pending" value={stats.pending} />
          <StatsCard icon={<CheckCircle />} label="Approved Today" value={stats.approved} />
          <StatsCard icon={<XCircle />} label="Rejected Today" value={stats.rejected} />
          <StatsCard icon={<ClipboardCheck />} label="Approval Rate" value={`${stats.rate}%`} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["all", "pending", "approved", "rejected"] as Filter[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "primary" : "secondary"}
              size="sm"
              onClick={() => { setFilter(f); setSelected([]); }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
          {selected.length > 0 && (
            <div className="ml-auto flex gap-2">
              <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">Approve ({selected.length})</Button>
              <Button variant="destructive" size="sm">Reject ({selected.length})</Button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<ClipboardCheck />} title="No approvals found" description="No tasks match the current filter." />
        ) : (
          <>
            <div className="hidden md:block">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
                      </TableHead>
                      <TableHead>Task Title</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>
                          <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} className="rounded" />
                        </TableCell>
                        <TableCell className="font-medium">{a.taskTitle}</TableCell>
                        <TableCell>{a.userName}</TableCell>
                        <TableCell><Badge variant="info">{a.proofType}</Badge></TableCell>
                        <TableCell>{formatDate(a.submittedAt)}</TableCell>
                        <TableCell>{formatCurrency(a.reward)}</TableCell>
                        <TableCell><Badge variant={statusBadge[a.status]}>{a.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setProofModal(a.id)}><Eye className="h-4 w-4" /></Button>
                            {a.status === "pending" && (
                              <>
                                <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">Approve</Button>
                                <Button variant="destructive" size="sm">Reject</Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <div className="grid gap-4 md:hidden">
              {filtered.map((a) => (
                <Card key={a.id}>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-on-surface">{a.taskTitle}</span>
                      <Badge variant={statusBadge[a.status]}>{a.status}</Badge>
                    </div>
                    <p className="text-sm text-on-surface-variant">{a.userName}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{formatCurrency(a.reward)}</span>
                      <span className="text-on-surface-variant">{formatDate(a.submittedAt)}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="ghost" size="sm" onClick={() => setProofModal(a.id)}>View Proof</Button>
                      {a.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700">Approve</Button>
                          <Button variant="destructive" size="sm">Reject</Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Modal isOpen={!!proofModal} onClose={() => setProofModal(null)} title="Review Proof" size="lg">
          {proof && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#0b1c30" }}>{proof.taskTitle}</span>
                <Badge variant={statusBadge[proof.status]}>{proof.status}</Badge>
              </div>
              <div style={{ overflow: "hidden", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                {proof.proofType === "screenshot" && proof.proofUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={proof.proofUrl} alt="Proof" style={{ maxHeight: "320px", width: "100%", objectFit: "contain" }} />
                )}
                {proof.proofType === "text" && (
                  <p style={{ padding: "16px", fontSize: "14px", color: "#0b1c30", whiteSpace: "pre-wrap", margin: 0 }}>{proof.proofText}</p>
                )}
                {proof.proofType === "url" && (
                  <a href={proof.proofUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "16px", fontSize: "14px", color: "#006c49", textDecoration: "underline", wordBreak: "break-all" }}>{proof.proofUrl}</a>
                )}
              </div>
              <p style={{ fontSize: "12px", color: "#3c4a42", margin: 0 }}>Submitted by {proof.userName} on {formatDate(proof.submittedAt)}</p>
              <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
                <Button variant="secondary" size="md" className="flex-1" onClick={() => setProofModal(null)}>Close</Button>
                {proof.status === "pending" && (
                  <>
                    <Button size="md" className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700">Approve</Button>
                    <Button variant="destructive" size="md" className="flex-1">Reject</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
