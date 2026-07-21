"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Landmark,
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Users,
  User,
  BarChart3,
  ClipboardCheck,
  DollarSign,
  Shield,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const earnerNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "Referrals", href: "/dashboard/referrals", icon: Users },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const adminNav: NavItem[] = [
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Task Approvals", href: "/admin/task-approvals", icon: ClipboardCheck },
  { label: "User Management", href: "/admin/user-management", icon: Users },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: DollarSign },
];

const superAdminNav: NavItem[] = [
  ...adminNav,
  { label: "Admin Management", href: "/super-admin/admin-management", icon: Shield },
];

function getNavItems(role: string): NavItem[] {
  switch (role) {
    case "super_admin":
      return superAdminNav;
    case "admin":
      return adminNav;
    default:
      return earnerNav;
  }
}

function roleBadgeColor(role: string) {
  switch (role) {
    case "super_admin":
      return "bg-error-container text-on-error-container";
    case "admin":
      return "bg-secondary-container text-on-secondary-container";
    default:
      return "bg-primary-container text-on-primary-container";
  }
}

function roleLabel(role: string) {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    default:
      return "Earner";
  }
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const currentRole = useUIStore((s) => s.currentRole);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const navItems = getNavItems(currentRole);

  return (
    <div className="flex h-full flex-col bg-surface-container-lowest border-r border-outline-variant">
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-outline-variant px-4",
          collapsed && "justify-center px-0"
        )}
      >
        <Landmark className="h-6 w-6 shrink-0 text-primary" />
        {!collapsed && (
          <span className="text-title-md whitespace-nowrap font-semibold">
            Kinetic Ledger
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant p-3">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-medium text-on-primary-container">
              {user?.name?.charAt(0) ?? "U"}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name ?? "User"}</p>
              <span
                className={cn(
                  "mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase leading-none",
                  roleBadgeColor(currentRole)
                )}
              >
                {roleLabel(currentRole)}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low",
            collapsed && "px-0"
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronsLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col transition-[width] duration-300 ease-in-out",
          sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[240px]"
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              key="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              key="sidebar-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="absolute right-2 top-3 z-10 rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low"
                >
                  <X className="h-5 w-5" />
                </button>
                <SidebarContent collapsed={false} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
