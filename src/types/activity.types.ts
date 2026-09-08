export type ActivityAction =
    | "CREATED"
    | "UPDATED"
    | "STATUS_CHANGED"
    | "DELETED"
    | "RESTORED";

export interface ActivityChanges {
    from: unknown;
    to: unknown;
}

export interface ActivityLog {
    taskId: number;
    action: ActivityAction;
    changes: ActivityChanges;
    timestamp: Date;
}
