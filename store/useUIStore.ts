import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  notificationPanelOpen: boolean;
  searchQuery: string;
  currentRole: "earner" | "admin" | "super_admin";
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCurrentRole: (role: "earner" | "admin" | "super_admin") => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  notificationPanelOpen: false,
  searchQuery: "",
  currentRole: "earner",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentRole: (role) => set({ currentRole: role }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
}));
