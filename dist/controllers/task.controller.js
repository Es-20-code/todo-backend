import {} from "express";
import * as taskService from "../services/task.service.js";
function parseId(value) {
    if (typeof value !== "string") {
        return null;
    }
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}
export async function createTask(req, res) {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating task",
        });
    }
}
export async function getTasks(req, res) {
    try {
        const tasks = await taskService.getTasks();
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({
            message: "Error getting tasks",
        });
    }
}
export async function getTask(req, res) {
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
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Error getting task" });
    }
}
export async function updateTask(req, res) {
    const id = parseId(req.params.id);
    if (id === null) {
        res.status(400).json({ message: "Invalid task id" });
        return;
    }
    try {
        const task = await taskService.updateTask(id, req.body);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating task" });
    }
}
export async function updateTaskStatus(req, res) {
    const id = parseId(req.params.id);
    const validStatuses = ["PENDING", "IN_PROGRESS", "DONE"];
    const status = req.body?.status;
    if (id === null || !validStatuses.includes(status)) {
        res.status(400).json({
            message: "A valid id and status are required",
            validStatuses,
        });
        return;
    }
    try {
        const task = await taskService.updateTaskStatus(id, status);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Error changing task status" });
    }
}
export async function deleteTask(req, res) {
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
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting task" });
    }
}
//# sourceMappingURL=task.controller.js.map