"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";

const roles = ["earner", "admin", "super_admin"] as const;

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

export default function Header() {
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);
  const currentRole = useUIStore((s) => s.currentRole);
  const setCurrentRole = useUIStore((s) => s.setCurrentRole);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const notificationPanelOpen = useUIStore((s) => s.notificationPanelOpen);
  const setNotificationPanelOpen = useUIStore((s) => s.setNotificationPanelOpen);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const notificationCount = 3;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-outline-variant bg-white px-4 lg:px-8">
      {/* Mobile hamburger */}
      <button
        onClick={toggleMobileSidebar}
        className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative ml-auto max-w-md flex-1 lg:ml-0 lg:flex-none">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
        />
      </div>

      {/* Notification bell */}
      <button
        onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
        className="relative rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low"
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-on-error">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Role switcher */}
      <div ref={roleRef} className="relative hidden md:block">
        <button
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className="flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low"
        >
          {roleLabel(currentRole)}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        {roleDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-outline-variant bg-surface-container-lowest p-1 shadow-lg">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setCurrentRole(role);
                  setRoleDropdownOpen(false);
                }}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  currentRole === role
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                )}
              >
                {roleLabel(role)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User avatar dropdown */}
      <div ref={userRef} className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-surface-container-low"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-sm font-medium text-on-primary-container">
              {user?.name?.charAt(0) ?? "U"}
            </div>
          )}
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight">{user?.name ?? "User"}</p>
            <p className="text-xs text-on-surface-variant">{roleLabel(currentRole)}</p>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-on-surface-variant sm:block" />
        </button>
        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-outline-variant bg-surface-container-lowest p-1 shadow-lg">
            <button
              onClick={() => {
                setUserMenuOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-error"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
