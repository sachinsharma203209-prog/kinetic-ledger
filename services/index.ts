import type { DashboardStats, Task, Transaction, Referral, TaskApproval, AdminUser, WithdrawalRequest, AdminInfo, AnalyticsData } from "@/types";
import { mockDashboardStats, mockTasks, mockTransactions, mockReferrals, mockTaskApprovals, mockAdminUsers, mockWithdrawalRequests, mockAdminInfo, mockAnalyticsData } from "@/lib/mockData";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(500);
    return mockDashboardStats;
  },
};

export const tasksService = {
  getAll: async (): Promise<Task[]> => {
    await delay(400);
    return mockTasks;
  },
  getById: async (id: string): Promise<Task | undefined> => {
    await delay(300);
    return mockTasks.find((t) => t.id === id);
  },
  getAvailable: async (): Promise<Task[]> => {
    await delay(400);
    return mockTasks.filter((t) => t.status === "available");
  },
};

export const transactionsService = {
  getAll: async (): Promise<Transaction[]> => {
    await delay(400);
    return mockTransactions;
  },
};

export const referralsService = {
  getAll: async (): Promise<Referral[]> => {
    await delay(400);
    return mockReferrals;
  },
};

export const adminService = {
  getTaskApprovals: async (): Promise<TaskApproval[]> => {
    await delay(400);
    return mockTaskApprovals;
  },
  getUsers: async (): Promise<AdminUser[]> => {
    await delay(400);
    return mockAdminUsers;
  },
  getWithdrawals: async (): Promise<WithdrawalRequest[]> => {
    await delay(400);
    return mockWithdrawalRequests;
  },
  getAdmins: async (): Promise<AdminInfo[]> => {
    await delay(400);
    return mockAdminInfo;
  },
  getAnalytics: async (): Promise<AnalyticsData> => {
    await delay(400);
    return mockAnalyticsData;
  },
};
