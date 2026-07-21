"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Target,
  CheckCircle2,
  Upload,
  ExternalLink,
  FileText,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTask } from "@/hooks/useQueries";
import { formatCurrency, formatDate } from "@/lib/utils";

function TaskDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-60 w-full rounded-lg" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}

function ProofModal({
  isOpen,
  onClose,
  taskTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
}) {
  const [proofText, setProofText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name ?? null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Proof">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "14px", color: "#3c4a42", margin: 0 }}>
          Submit your proof for: <span style={{ fontWeight: 500, color: "#0b1c30" }}>{taskTitle}</span>
        </p>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#3c4a42" }}>
            Upload File
          </label>
          <label style={{ display: "flex", cursor: "pointer", flexDirection: "column", alignItems: "center", gap: "8px", borderRadius: "8px", border: "2px dashed #bbcabf", backgroundColor: "#e5eeff", padding: "32px", textAlign: "center", transition: "border-color 0.2s" }}>
            <Upload style={{ width: "32px", height: "32px", color: "rgba(60,74,66,0.5)" }} />
            <span style={{ fontSize: "14px", color: "#3c4a42" }}>
              {fileName ?? "Click to upload screenshot or file"}
            </span>
            {fileName && (
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#006c49" }}>{fileName}</span>
            )}
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <Input
          label="Proof URL or Description"
          placeholder="Paste URL or describe what you did..."
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          leftIcon={<FileText className="h-4 w-4" />}
        />

        <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
          <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button size="md" className="flex-1" onClick={onClose}>
            Submit Proof
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function TaskDetailClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: task, isLoading } = useTask(id);
  const [proofOpen, setProofOpen] = useState(false);

  if (isLoading) {
    return (
      <DashboardLayout>
        <TaskDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={<Target />}
          title="Task not found"
          description="This task may have been removed or doesn't exist."
          action={{ label: "Go back", onClick: () => router.back() }}
        />
      </DashboardLayout>
    );
  }

  const difficultyVariant = {
    easy: "success" as const,
    medium: "warning" as const,
    hard: "error" as const,
  };
  const completionPct = Math.round(
    (task.completionsCurrent / task.completionsRequired) * 100
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={difficultyVariant[task.difficulty]}>
                {task.difficulty}
              </Badge>
              {task.label && <Badge variant="info">{task.label}</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-on-surface">{task.title}</h1>
            <p className="text-sm text-on-surface-variant">{task.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-3xl font-bold text-on-surface">
              {formatCurrency(task.reward)}
            </p>
            <p className="text-xs text-on-surface-variant">Reward</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {task.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm text-on-surface">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {task.url && (
              <Card>
                <CardContent className="pt-6">
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open task link in new tab
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-on-surface-variant" />
                  <div>
                    <p className="text-xs text-on-surface-variant">Estimated Time</p>
                    <p className="text-sm font-medium text-on-surface">{task.estimatedTime}</p>
                  </div>
                </div>
                {task.deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-on-surface-variant" />
                    <div>
                      <p className="text-xs text-on-surface-variant">Deadline</p>
                      <p className="text-sm font-medium text-on-surface">
                        {formatDate(task.deadline)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <div className="mb-1 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Completions</span>
                    <span className="font-medium text-on-surface">
                      {task.completionsCurrent}/{task.completionsRequired}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-on-surface-variant">
                    {completionPct}% completed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full"
              onClick={() => setProofOpen(true)}
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Proof
            </Button>
          </div>
        </div>
      </div>

      <ProofModal
        isOpen={proofOpen}
        onClose={() => setProofOpen(false)}
        taskTitle={task.title}
      />
    </DashboardLayout>
  );
}
