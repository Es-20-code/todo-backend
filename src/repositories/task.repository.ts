import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { mysqlPool } from "../config/mysql.js";
import type {
    CreateTaskDTO,
    Task,
    TaskStatus,
    UpdateTaskDTO,
} from "../types/task.types.js";

const TASK_COLUMNS = `
    id,
    title,
    description,
    status,
    due_date,
    created_at,
    updated_at,
    deleted_at
`;

export async function createTask(
    data: CreateTaskDTO
): Promise<Task> {
    const [result] =
    await mysqlPool.execute<ResultSetHeader>(
        `
        INSERT INTO tasks (
        title,
        description,
        due_date
        )
        VALUES (?, ?, ?)
        `,
        [
        data.title,
        data.description ?? null,
        data.due_date ?? null,
        ]
    );

    const task = await findTaskById(result.insertId);

    if (!task) {
    throw new Error("TASK_CREATION_FAILED");
    }

    return task;
}

export async function findAllTasks(
    status?: TaskStatus
): Promise<Task[]> {
    const conditions = ["deleted_at IS NULL"];
    const params: string[] = [];

    if (status) {
        conditions.push("status = ?");
        params.push(status);
    }

    const [rows] =
    await mysqlPool.execute<RowDataPacket[]>(
        `
        SELECT ${TASK_COLUMNS}
        FROM tasks
        WHERE ${conditions.join(" AND ")}
        ORDER BY created_at DESC
        `,
        params
    );

    return rows as Task[];
}

export async function findTaskById(
    id: number
): Promise<Task | null> {
    const [rows] =
    await mysqlPool.execute<RowDataPacket[]>(
        `
        SELECT ${TASK_COLUMNS}
        FROM tasks
        WHERE id = ?
        AND deleted_at IS NULL
        `,
        [id]
    );

    if (rows.length === 0) {
    return null;
    }

    return rows[0] as Task;
}

export async function findTaskByIdIncludingDeleted(
    id: number
): Promise<Task | null> {
    const [rows] =
    await mysqlPool.execute<RowDataPacket[]>(
        `
        SELECT ${TASK_COLUMNS}
        FROM tasks
        WHERE id = ?
        `,
        [id]
    );

    if (rows.length === 0) {
    return null;
    }

    return rows[0] as Task;
}

export async function updateTask(
    id: number,
    data: UpdateTaskDTO
): Promise<Task | null> {
    await mysqlPool.execute(
    `
    UPDATE tasks
    SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status)
    WHERE id = ?
    AND deleted_at IS NULL
    `,
    [
        data.title ?? null,
        data.description ?? null,
        data.status ?? null,
        id,
    ]
    );

    return findTaskById(id);
}

export async function softDeleteTask(
    id: number
): Promise<boolean> {
    const [result] =
    await mysqlPool.execute<ResultSetHeader>(
        `
        UPDATE tasks
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = ?
        AND deleted_at IS NULL
        `,
        [id]
    );

    return result.affectedRows > 0;
}
