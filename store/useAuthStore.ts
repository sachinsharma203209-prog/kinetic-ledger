import { create } from "zustand";
import type { User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const mockUser: User = {
  id: "usr_001",
  name: "Alex Morgan",
  email: "alex@kineticledger.com",
  avatar: undefined,
  role: "earner",
  status: "active",
  balance: 2847.5,
  totalEarnings: 12450.0,
  pendingRewards: 185.5,
  referralCode: "ALEX2024",
  joinedAt: "2024-01-15T00:00:00Z",
  tasksCompleted: 156,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  login: async (_email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
}));
