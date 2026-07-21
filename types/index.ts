export type UserRole = "earner" | "advertiser" | "admin" | "super_admin";

export type TaskStatus = "available" | "in_progress" | "submitted" | "approved" | "rejected";
export type TaskCategory = "social_media" | "micro_task" | "survey" | "content" | "other";
export type TaskDifficulty = "easy" | "medium" | "hard";
export type TaskLabel = "featured" | "popular" | "new" | "trending";

export type TransactionStatus = "pending" | "approved" | "rejected" | "completed";
export type TransactionType = "deposit" | "withdrawal" | "earning" | "referral_bonus" | "commission";

export type WithdrawalMethod = "paypal" | "bank_transfer" | "crypto";
export type WithdrawalStatus = "pending" | "processing" | "completed" | "rejected";

export type UserStatus = "active" | "pending" | "banned";
export type ProofType = "screenshot" | "text" | "url";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  balance: number;
  totalEarnings: number;
  pendingRewards: number;
  referralCode: string;
  joinedAt: string;
  tasksCompleted: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  reward: number;
  estimatedTime: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  label?: TaskLabel;
  status: TaskStatus;
  proofTypes: ProofType[];
  imageUrl?: string;
  url?: string;
  createdBy: string;
  createdAt: string;
  deadline?: string;
  completionsRequired: number;
  completionsCurrent: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  createdAt: string;
  reference?: string;
}

export interface Referral {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  status: "active" | "inactive" | "pending";
  yield: number;
  tasksCompleted: number;
}

export interface WithdrawalRequest {
  id: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  amount: number;
  method: WithdrawalMethod;
  status: WithdrawalStatus;
  requestDate: string;
  processedDate?: string;
  accountDetails: string;
}

export interface TaskApproval {
  id: string;
  taskTitle: string;
  userName: string;
  userAvatar?: string;
  proofType: ProofType;
  proofUrl?: string;
  proofText?: string;
  submittedAt: string;
  reward: number;
  status: "pending" | "approved" | "rejected";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  balance: number;
  joinedDate: string;
  lastActive: string;
  tasksCompleted: number;
}

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "super_admin";
  status: UserStatus;
  assignedTasks: number;
  approvalRate: number;
  joinedDate: string;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  commissionEarned: number;
  tasksCompleted: number;
  pendingApprovals: number;
  pendingWithdrawals: number;
  totalVolume: number;
  monthlyGrowth: number;
  userGrowthData: { month: string; users: number }[];
  revenueData: { month: string; revenue: number; commission: number }[];
  taskCompletionData: { month: string; completed: number; rejected: number }[];
}

export interface WalletBalance {
  current: number;
  totalEarnings: number;
  pendingRewards: number;
  referralBonus: number;
  sparklineData: number[];
}

export interface DashboardStats {
  balance: WalletBalance;
  activeTasks: number;
  completedTasks: number;
  pendingRewards: number;
  referralEarnings: number;
  recentTransactions: Transaction[];
  availableTasks: Task[];
  weeklyEarningData: { day: string; amount: number }[];
}
