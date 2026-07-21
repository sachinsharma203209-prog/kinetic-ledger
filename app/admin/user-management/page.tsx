"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { SearchBox } from "@/components/ui/SearchBox";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { useAdminUsers } from "@/hooks/useQueries";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Users, UserCheck, Clock, Ban } from "lucide-react";

type StatusFilter = "all" | "active" | "pending" | "banned";

const statusBadge: Record<string, "success" | "warning" | "error" | "default"> = {
  active: "success",
  pending: "warning",
  banned: "error",
};

export default function UserManagementPage() {
  const { data: users, isLoading } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [detailUser, setDetailUser] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const stats = useMemo(() => {
    if (!users) return { total: 0, active: 0, pending: 0, banned: 0 };
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      pending: users.filter((u) => u.status === "pending").length,
      banned: users.filter((u) => u.status === "banned").length,
    };
  }, [users]);

  const user = users?.find((u) => u.id === detailUser);

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
        <h1 className="text-2xl font-bold text-on-surface">User Management</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Users />} label="Total Users" value={stats.total} />
          <StatsCard icon={<UserCheck />} label="Active" value={stats.active} />
          <StatsCard icon={<Clock />} label="Pending" value={stats.pending} />
          <StatsCard icon={<Ban />} label="Banned" value={stats.banned} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBox onSearch={setSearch} placeholder="Search users..." className="sm:w-72" />
          <div className="flex gap-2">
            {(["all", "active", "pending", "banned"] as StatusFilter[]).map((f) => (
              <Button key={f} variant={statusFilter === f ? "primary" : "secondary"} size="sm" onClick={() => setStatusFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Users />} title="No users found" description="No users match the current filters." />
        ) : (
          <>
            <div className="hidden lg:block">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar src={u.avatar} initials={u.name.charAt(0)} size="sm" />
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-on-surface-variant">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={u.role === "admin" ? "info" : "default"}>{u.role}</Badge></TableCell>
                        <TableCell><Badge variant={statusBadge[u.status]}>{u.status}</Badge></TableCell>
                        <TableCell>{formatCurrency(u.balance)}</TableCell>
                        <TableCell>{formatDate(u.joinedDate)}</TableCell>
                        <TableCell>{u.tasksCompleted}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setDetailUser(u.id)}>View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <div className="grid gap-4 lg:hidden">
              {filtered.map((u) => (
                <Card key={u.id}>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={u.avatar} initials={u.name.charAt(0)} />
                      <div className="flex-1">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-on-surface-variant">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={u.role === "admin" ? "info" : "default"}>{u.role}</Badge>
                      <Badge variant={statusBadge[u.status]}>{u.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(u.balance)}</span>
                      <span>{u.tasksCompleted} tasks</span>
                      <span>{formatDate(u.joinedDate)}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setDetailUser(u.id)} className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Modal isOpen={!!detailUser} onClose={() => setDetailUser(null)} title="User Details">
          {user && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
                <Avatar src={user.avatar} initials={user.name.charAt(0)} size="lg" />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "18px", fontWeight: 600, color: "#0b1c30", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                  <p style={{ fontSize: "14px", color: "#3c4a42", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Role", value: <Badge variant={user.role === "admin" ? "info" : "default"}>{user.role}</Badge> },
                  { label: "Status", value: <Badge variant={statusBadge[user.status]}>{user.status}</Badge> },
                  { label: "Balance", value: <span style={{ fontSize: "14px", fontWeight: 500, color: "#0b1c30" }}>{formatCurrency(user.balance)}</span> },
                  { label: "Tasks Completed", value: <span style={{ fontSize: "14px", fontWeight: 500, color: "#0b1c30" }}>{user.tasksCompleted}</span> },
                  { label: "Joined", value: <span style={{ fontSize: "14px", fontWeight: 500, color: "#0b1c30" }}>{formatDate(user.joinedDate)}</span> },
                  { label: "Last Active", value: <span style={{ fontSize: "14px", fontWeight: 500, color: "#0b1c30" }}>{formatDate(user.lastActive)}</span> },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#eff4ff", borderRadius: "8px", padding: "12px 16px" }}>
                    <span style={{ fontSize: "14px", color: "#3c4a42" }}>{row.label}</span>
                    {row.value}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
                {user.status !== "banned" ? (
                  <Button variant="destructive" size="md" className="flex-1">Ban User</Button>
                ) : (
                  <Button variant="secondary" size="md" className="flex-1">Unban User</Button>
                )}
                <Button variant="secondary" size="md" className="flex-1">Change Role</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
