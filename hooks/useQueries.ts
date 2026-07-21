"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService, tasksService, transactionsService, referralsService, adminService } from "@/services";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });
}

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: tasksService.getAll,
  });
}

export function useAvailableTasks() {
  return useQuery({
    queryKey: ["tasks", "available"],
    queryFn: tasksService.getAvailable,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => tasksService.getById(id),
    enabled: !!id,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsService.getAll,
  });
}

export function useReferrals() {
  return useQuery({
    queryKey: ["referrals"],
    queryFn: referralsService.getAll,
  });
}

export function useTaskApprovals() {
  return useQuery({
    queryKey: ["task-approvals"],
    queryFn: adminService.getTaskApprovals,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: adminService.getUsers,
  });
}

export function useWithdrawalRequests() {
  return useQuery({
    queryKey: ["withdrawal-requests"],
    queryFn: adminService.getWithdrawals,
  });
}

export function useAdminInfo() {
  return useQuery({
    queryKey: ["admin-info"],
    queryFn: adminService.getAdmins,
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: adminService.getAnalytics,
  });
}
