import type { CreateTaskDTO, TaskStatus, UpdateTaskDTO } from "../types/task.types.js";
export declare function createTask(data: CreateTaskDTO): Promise<import("../types/task.types.js").Task>;
export declare function getTasks(): Promise<import("../types/task.types.js").Task[]>;
export declare function getTask(id: number): Promise<import("../types/task.types.js").Task | null>;
export declare function updateTask(id: number, data: UpdateTaskDTO): Promise<import("../types/task.types.js").Task | null>;
export declare function updateTaskStatus(id: number, status: TaskStatus): Promise<import("../types/task.types.js").Task | null>;
export declare function deleteTask(id: number): Promise<boolean>;
//# sourceMappingURL=task.service.d.ts.map