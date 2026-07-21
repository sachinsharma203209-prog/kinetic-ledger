"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Eye } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import type { TaskDifficulty } from "@/types";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  instructions: z
    .array(z.object({ value: z.string().min(1, "Instruction cannot be empty") }))
    .min(1, "At least one instruction required"),
  reward: z.number().min(0.5, "Minimum reward is $0.50"),
  category: z.string().min(1, "Select a category"),
  difficulty: z.string().min(1, "Select difficulty"),
  deadline: z.string().optional(),
  completionsRequired: z.number().min(1, "At least 1 completion required"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const categoryOptions = [
  { value: "social_media", label: "Social Media" },
  { value: "micro_task", label: "Micro Task" },
  { value: "survey", label: "Survey" },
  { value: "content", label: "Content" },
  { value: "other", label: "Other" },
];

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const difficultyVariant = {
  easy: "success" as const,
  medium: "warning" as const,
  hard: "error" as const,
};

function PreviewCard({ values }: { values: Partial<TaskFormValues> }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">
            {values.title || "Task Title"}
          </CardTitle>
          {values.difficulty && (
            <Badge variant={difficultyVariant[values.difficulty as TaskDifficulty]}>
              {values.difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-on-surface-variant line-clamp-2">
          {values.description || "Task description will appear here."}
        </p>
        {values.instructions && values.instructions.length > 0 && (
          <p className="text-xs text-on-surface-variant">
            {values.instructions.filter((i) => i.value).length} instruction(s)
          </p>
        )}
        <div className="flex items-center justify-between border-t border-outline-variant pt-3">
          <span className="text-lg font-bold text-on-surface">
            {formatCurrency(values.reward ?? 0)}
          </span>
          {values.completionsRequired ? (
            <span className="text-xs text-on-surface-variant">
              {values.completionsRequired} completions
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CreateTaskPage() {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema) as never,
    defaultValues: {
      title: "",
      description: "",
      instructions: [{ value: "" }],
      reward: 1,
      category: "",
      difficulty: "",
      deadline: "",
      completionsRequired: 10,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "instructions" });
  const watched = watch();

  const onSubmit = () => {
    setSubmitted(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Create Task</h1>
          <p className="text-sm text-on-surface-variant">
            Fill in the details below to create a new task for earners.
          </p>
        </div>

        {submitted && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Task created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit(() => onSubmit())} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                placeholder="e.g. Follow & Like Instagram Post"
                error={errors.title?.message}
                {...register("title")}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                  Description
                </label>
                <textarea
                  className="h-24 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
                  placeholder="Describe what the earner needs to do..."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-error">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Instructions</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => append({ value: "" })}
              >
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <span className="mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <Input
                      placeholder={`Step ${index + 1}...`}
                      error={errors.instructions?.[index]?.value?.message}
                      {...register(`instructions.${index}.value`)}
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-2.5 rounded p-1 text-on-surface-variant hover:bg-surface-container hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Reward ($)"
                  type="number"
                  step="0.50"
                  min="0.5"
                  error={errors.reward?.message}
                  {...register("reward")}
                />
                <Input
                  label="Completions Required"
                  type="number"
                  min="1"
                  error={errors.completionsRequired?.message}
                  {...register("completionsRequired")}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select category"
                  error={errors.category?.message}
                  {...register("category")}
                />
                <Select
                  label="Difficulty"
                  options={difficultyOptions}
                  placeholder="Select difficulty"
                  error={errors.difficulty?.message}
                  {...register("difficulty")}
                />
              </div>
              <Input
                label="Deadline (optional)"
                type="date"
                {...register("deadline")}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              Create Task
            </Button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Task Preview"
        size="lg"
      >
        <PreviewCard values={watched} />
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
