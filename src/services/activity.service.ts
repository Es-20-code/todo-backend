import { getMongoDB } from "../config/mongodb.js";

import type {
    ActivityAction,
    ActivityChanges,
    ActivityLog,
} from "../types/activity.types.js";

export async function logActivity(
    taskId: number,
    action: ActivityAction,
    changes: ActivityChanges
): Promise<void> {
    const db = getMongoDB();
    const collection = db.collection<ActivityLog>("activity_logs");

    await collection.insertOne({
        taskId,
        action,
        changes,
        timestamp: new Date(),
    });
}

export async function getActivityLogsByTaskId(
    taskId: number,
    order: "asc" | "desc" = "desc"
): Promise<ActivityLog[]> {
    const db = getMongoDB();
    const collection = db.collection<ActivityLog>("activity_logs");

    return collection
        .find({ taskId })
        .sort({ timestamp: order === "asc" ? 1 : -1 })
        .toArray();
}
