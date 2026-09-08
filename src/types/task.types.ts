export type TaskStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "DONE";

export const TASK_STATUSES: TaskStatus[] = [
    "PENDING",
    "IN_PROGRESS",
    "DONE",
];

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    due_date: Date | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface CreateTaskDTO {
    title: string;
    description?: string;
    due_date?: string;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
}
