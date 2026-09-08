import { getMongoDB } from "../config/mongodb.js";
export async function logActivity(taskId, action, data = {}) {
    const db = getMongoDB();
    const collection = db.collection("activity_logs");
    await collection.insertOne({
        taskId,
        action,
        data,
        createdAt: new Date(),
    });
}
//# sourceMappingURL=activity.service.js.map