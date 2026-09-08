import * as taskRepository
    from "../repositories/task.repository.js";

import { logActivity, getActivityLogsByTaskId }
    from "./activity.service.js";

import type {
    CreateTaskDTO,
    TaskStatus,
    UpdateTaskDTO,
} from "../types/task.types.js";

export async function createTask(
    data: CreateTaskDTO
) {
    const task =
    await taskRepository.createTask(data);

    await logActivity(task.id, "CREATED", {
        from: null,
        to: {
            title: task.title,
            status: task.status,
        },
    });

    return task;
}

export async function getTasks(status?: TaskStatus) {
    return taskRepository.findAllTasks(status);
}

export async function getTask(id: number) {
    return taskRepository.findTaskById(id);
}

export async function updateTask(
    id: number,
    data: UpdateTaskDTO
) {
    const previousTask = await taskRepository.findTaskById(id);

    if (!previousTask) {
        return null;
    }

    const task = await taskRepository.updateTask(id, data);

    if (!task) {
        return null;
    }

    if (data.title !== undefined || data.description !== undefined) {
        const from: Record<string, unknown> = {};
        const to: Record<string, unknown> = {};

        if (
            data.title !== undefined &&
            data.title !== previousTask.title
        ) {
            from.title = previousTask.title;
            to.title = task.title;
        }

        if (
            data.description !== undefined &&
            data.description !== previousTask.description
        ) {
            from.description = previousTask.description;
            to.description = task.description;
        }

        if (Object.keys(to).length > 0) {
            await logActivity(task.id, "UPDATED", { from, to });
        }
    }

    if (
        data.status !== undefined &&
        data.status !== previousTask.status
    ) {
        await logActivity(task.id, "STATUS_CHANGED", {
            from: previousTask.status,
            to: task.status,
        });
    }

    return task;
}

export async function deleteTask(id: number) {
    const task = await taskRepository.findTaskById(id);

    if (!task) {
        return false;
    }

    const deleted = await taskRepository.softDeleteTask(id);

    if (deleted) {
        await logActivity(id, "DELETED", {
            from: {
                title: task.title,
                status: task.status,
            },
            to: null,
        });
    }

    return deleted;
}

export async function getTaskHistory(id: number) {
    const task = await taskRepository.findTaskByIdIncludingDeleted(id);

    if (!task) {
        return null;
    }

    const events = await getActivityLogsByTaskId(id, "asc");

    return {
        task: {
            id: task.id,
            title: task.title,
            status: task.status,
            deletedAt: task.deleted_at,
        },
        events: events.map((event) => ({
            action: event.action,
            timestamp: event.timestamp,
            changes: event.changes,
        })),
    };
}
