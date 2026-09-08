import { mysqlPool } from "../config/mysql.js";
export async function createTask(data) {
    const [result] = await mysqlPool.execute(`
        INSERT INTO tasks (
        title,
        description,
        due_date
        )
        VALUES (?, ?, ?)
        `, [
        data.title,
        data.description ?? null,
        data.due_date ?? null,
    ]);
    const task = await findTaskById(result.insertId);
    if (!task) {
        throw new Error("TASK_CREATION_FAILED");
    }
    return task;
}
export async function findAllTasks() {
    const [rows] = await mysqlPool.execute(`
        SELECT
        id,
        title,
        description,
        status,
        due_date,
        created_at,
        updated_at,
        deleted_at
        FROM tasks
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        `);
    return rows;
}
export async function findTaskById(id) {
    const [rows] = await mysqlPool.execute(`
        SELECT
        id,
        title,
        description,
        status,
        due_date,
        created_at,
        updated_at,
        deleted_at
        FROM tasks
        WHERE id = ?
        AND deleted_at IS NULL
        `, [id]);
    if (rows.length === 0) {
        return null;
    }
    return rows[0];
}
export async function updateTask(id, data) {
    await mysqlPool.execute(`
    UPDATE tasks
    SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        due_date = COALESCE(?, due_date)
    WHERE id = ?
    AND deleted_at IS NULL
    `, [
        data.title ?? null,
        data.description ?? null,
        data.due_date ?? null,
        id,
    ]);
    return findTaskById(id);
}
export async function updateTaskStatus(id, status) {
    await mysqlPool.execute(`
    UPDATE tasks
    SET status = ?
    WHERE id = ?
    AND deleted_at IS NULL
    `, [status, id]);
    return findTaskById(id);
}
export async function softDeleteTask(id) {
    const [result] = await mysqlPool.execute(`
        UPDATE tasks
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = ?
        AND deleted_at IS NULL
        `, [id]);
    return result.affectedRows > 0;
}
//# sourceMappingURL=task.repository.js.map