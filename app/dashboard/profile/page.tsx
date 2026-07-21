"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { User, Mail, Phone, Calendar, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDashboardStats } from "@/hooks/useQueries";
import { formatDate } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

void profileSchema;
void passwordSchema;

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { isLoading } = useDashboardStats();
  const [notifications, setNotifications] = useState({ email: true, tasks: true, referrals: false });

  const profileForm = useForm<ProfileForm>({ defaultValues: { name: "", email: "", phone: "", bio: "" } });
  const passwordForm = useForm<PasswordForm>();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-40" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const user = {
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "Earner" as const,
    joinedAt: "2024-03-15",
    avatar: "",
  };

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button type="button" onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-surface-container"}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar src={user.avatar} initials={initials} size="lg" className="h-20 w-20 text-2xl" />
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold text-on-surface">{user.name}</h1>
              <p className="text-sm text-on-surface-variant">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="info">{user.role}</Badge>
                <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <Calendar className="h-3 w-3" /> Member since {formatDate(user.joinedAt)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(() => {})} className="space-y-4">
                <Input label="Full Name" {...profileForm.register("name")} error={profileForm.formState.errors.name?.message} leftIcon={<User className="h-4 w-4" />} />
                <Input label="Email" type="email" {...profileForm.register("email")} error={profileForm.formState.errors.email?.message} leftIcon={<Mail className="h-4 w-4" />} />
                <Input label="Phone" {...profileForm.register("phone")} leftIcon={<Phone className="h-4 w-4" />} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Bio</label>
                  <textarea {...profileForm.register("bio")} rows={3} className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none resize-none" />
                </div>
                <Button variant="primary" type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Ensure your account stays secure.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(() => {})} className="space-y-4">
                  <Input label="Current Password" type="password" {...passwordForm.register("currentPassword")} error={passwordForm.formState.errors.currentPassword?.message} />
                  <Input label="New Password" type="password" {...passwordForm.register("newPassword")} error={passwordForm.formState.errors.newPassword?.message} />
                  <Input label="Confirm Password" type="password" {...passwordForm.register("confirmPassword")} error={passwordForm.formState.errors.confirmPassword?.message} />
                  <Button variant="secondary" type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {([["email", "Email notifications"], ["tasks", "Task alerts"], ["referrals", "Referral updates"]] as const).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">{label}</span>
                    <Toggle checked={notifications[key]} onChange={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-error/30">
          <CardHeader>
            <CardTitle className="text-error">Danger Zone</CardTitle>
            <CardDescription>Permanently delete your account and all associated data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" /> Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
