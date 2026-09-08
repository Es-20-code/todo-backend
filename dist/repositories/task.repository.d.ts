import type { CreateTaskDTO, Task, TaskStatus, UpdateTaskDTO } from "../types/task.types.js";
export declare function createTask(data: CreateTaskDTO): Promise<Task>;
export declare function findAllTasks(): Promise<Task[]>;
export declare function findTaskById(id: number): Promise<Task | null>;
export declare function updateTask(id: number, data: UpdateTaskDTO): Promise<Task | null>;
export declare function updateTaskStatus(id: number, status: TaskStatus): Promise<Task | null>;
export declare function softDeleteTask(id: number): Promise<boolean>;
//# sourceMappingURL=task.repository.d.ts.map