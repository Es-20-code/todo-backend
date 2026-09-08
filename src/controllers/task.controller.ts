import { type Request, type Response } from "express";

import * as taskService
    from "../services/task.service.js";

import { TASK_STATUSES } from "../types/task.types.js";
import type { Task, TaskStatus } from "../types/task.types.js";

function parseId(value: unknown): number | null {
    if (typeof value !== "string") {
        return null;
    }

    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isValidStatus(value: unknown): value is TaskStatus {
    return (
        typeof value === "string" &&
        TASK_STATUSES.includes(value as TaskStatus)
    );
}

function toTaskResponse(task: Task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.due_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        deletedAt: task.deleted_at,
    };
}

export async function createTask(
    req: Request,
    res: Response
) {
    const { title, description, dueDate } = req.body ?? {};

    if (typeof title !== "string" || title.trim() === "") {
        res.status(400).json({ message: "Title is required" });
        return;
    }

    try {
    const task =
        await taskService.createTask({
            title: title.trim(),
            description,
            due_date: dueDate ?? undefined,
        });

    res.status(201).json(toTaskResponse(task));
    } catch (error) {
    console.error(error);
    res.status(500).json({
        message: "Error creating task",
    });
    }
}

export async function getTasks(
    req: Request,
    res: Response
) {
    const statusParam = req.query.status;

    let status: TaskStatus | undefined;

    if (statusParam !== undefined) {
        if (!isValidStatus(statusParam)) {
            res.status(400).json({
                message: "Invalid status filter",
                validStatuses: TASK_STATUSES,
            });
            return;
        }
        status = statusParam;
    }

    try {
    const tasks =
        await taskService.getTasks(status);

    res.json(tasks.map(toTaskResponse));
    } catch (error) {
    console.error(error);
    res.status(500).json({
        message: "Error getting tasks",
    });
    }
}

export async function getTask(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "Invalid task id" });
        return;
    }

    try {
        const task = await taskService.getTask(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(toTaskResponse(task));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting task" });
    }
}

export async function updateTask(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "Invalid task id" });
        return;
    }

    const { title, description, status } = req.body ?? {};

    if (
        title !== undefined &&
        (typeof title !== "string" || title.trim() === "")
    ) {
        res.status(400).json({ message: "Title cannot be empty" });
        return;
    }

    if (status !== undefined && !isValidStatus(status)) {
        res.status(400).json({
            message: "Invalid status",
            validStatuses: TASK_STATUSES,
        });
        return;
    }

    try {
        const task = await taskService.updateTask(id, {
            title: title !== undefined ? title.trim() : undefined,
            description,
            status,
        });

        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(toTaskResponse(task));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating task" });
    }
}

export async function getTaskHistory(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "Invalid task id" });
        return;
    }

    try {
        const history = await taskService.getTaskHistory(id);
        if (!history) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting task history" });
    }
}

export async function deleteTask(req: Request, res: Response) {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "Invalid task id" });
        return;
    }

    try {
        const deleted = await taskService.deleteTask(id);
        if (!deleted) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task" });
    }
}
