"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { useAdminInfo } from "@/hooks/useQueries";
import { formatDate } from "@/lib/utils";
import { Shield, UserCheck, Clock, TrendingUp, Plus } from "lucide-react";

const statusBadge: Record<string, "success" | "warning" | "error"> = {
  active: "success",
  pending: "warning",
  banned: "error",
};

export default function AdminManagementPage() {
  const { data: admins, isLoading } = useAdminInfo();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "admin" as "admin" | "super_admin" });

  const stats = useMemo(() => {
    if (!admins) return { total: 0, active: 0, pending: 0, avgRate: 0 };
    return {
      total: admins.length,
      active: admins.filter((a) => a.status === "active").length,
      pending: admins.filter((a) => a.status === "pending").length,
      avgRate: Math.round(admins.reduce((sum, a) => sum + a.approvalRate, 0) / (admins.length || 1)),
    };
  }, [admins]);

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-on-surface">Admin Management</h1>
          <Button onClick={() => setShowAddModal(true)}><Plus className="h-4 w-4" /> Add Admin</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={<Shield />} label="Total Admins" value={stats.total} />
          <StatsCard icon={<UserCheck />} label="Active" value={stats.active} />
          <StatsCard icon={<Clock />} label="Pending" value={stats.pending} />
          <StatsCard icon={<TrendingUp />} label="Avg Approval Rate" value={`${stats.avgRate}%`} />
        </div>

        {!admins || admins.length === 0 ? (
          <EmptyState icon={<Shield />} title="No admins found" description="No admin accounts have been created yet." />
        ) : (
          <>
            <div className="hidden lg:block">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Approval Rate</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar src={a.avatar} initials={a.name.charAt(0)} size="sm" />
                            <div>
                              <p className="font-medium">{a.name}</p>
                              <p className="text-xs text-on-surface-variant">{a.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={a.role === "super_admin" ? "info" : "default"}>
                            {a.role.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell><Badge variant={statusBadge[a.status]}>{a.status}</Badge></TableCell>
                        <TableCell>{a.assignedTasks}</TableCell>
                        <TableCell>{a.approvalRate}%</TableCell>
                        <TableCell>{formatDate(a.joinedDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-error">Deactivate</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <div className="grid gap-4 lg:hidden">
              {admins.map((a) => (
                <Card key={a.id}>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={a.avatar} initials={a.name.charAt(0)} />
                      <div className="flex-1">
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-on-surface-variant">{a.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={a.role === "super_admin" ? "info" : "default"}>{a.role.replace("_", " ")}</Badge>
                      <Badge variant={statusBadge[a.status]}>{a.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{a.assignedTasks} tasks</span>
                      <span>{a.approvalRate}% rate</span>
                      <span>{formatDate(a.joinedDate)}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="secondary" size="sm" className="flex-1">Edit</Button>
                      <Button variant="destructive" size="sm" className="flex-1">Deactivate</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Admin">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input label="Name" placeholder="Admin name" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} />
            <Input label="Email" placeholder="admin@example.com" type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
            <Select label="Role" options={[{ value: "admin", label: "Admin" }, { value: "super_admin", label: "Super Admin" }]} value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as "admin" | "super_admin" })} />
            <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
              <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button size="md" className="flex-1" onClick={() => setShowAddModal(false)}>Create Admin</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
