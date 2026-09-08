import * as taskRepository from "../repositories/task.repository.js";
import { logActivity } from "./activity.service.js";
export async function createTask(data) {
    const task = await taskRepository.createTask(data);
    await logActivity(task.id, "TASK_CREATED", {
        title: task.title,
        status: task.status,
    });
    return task;
}
export async function getTasks() {
    return taskRepository.findAllTasks();
}
export async function getTask(id) {
    return taskRepository.findTaskById(id);
}
export async function updateTask(id, data) {
    const task = await taskRepository.updateTask(id, data);
    if (task) {
        await logActivity(task.id, "TASK_UPDATED", { ...data });
    }
    return task;
}
export async function updateTaskStatus(id, status) {
    const previousTask = await taskRepository.findTaskById(id);
    const task = await taskRepository.updateTaskStatus(id, status);
    if (task) {
        await logActivity(task.id, "TASK_STATUS_CHANGED", {
            previousStatus: previousTask?.status ?? null,
            status: task.status,
        });
    }
    return task;
}
export async function deleteTask(id) {
    const task = await taskRepository.findTaskById(id);
    const deleted = await taskRepository.softDeleteTask(id);
    if (deleted && task) {
        await logActivity(id, "TASK_DELETED", {
            title: task.title,
            status: task.status,
        });
    }
    return deleted;
}
//# sourceMappingURL=task.service.js.map