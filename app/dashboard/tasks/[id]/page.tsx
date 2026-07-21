import TaskDetailClient from "@/components/dashboard/TaskDetailClient";
import { mockTasks } from "@/lib/mockData";

export function generateStaticParams() {
  return mockTasks.map((task) => ({
    id: task.id,
  }));
}

export default function TaskDetailPage() {
  return <TaskDetailClient />;
}
