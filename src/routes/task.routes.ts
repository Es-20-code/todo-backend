import { Router } from "express";

import * as taskController
    from "../controllers/task.controller.js";

const router = Router();

router.post(
    "/",
    taskController.createTask
);

router.get(
    "/",
    taskController.getTasks
);

router.get(
    "/:id/history",
    taskController.getTaskHistory
);

router.get(
    "/:id",
    taskController.getTask
);

router.patch(
    "/:id",
    taskController.updateTask
);

router.delete(
    "/:id",
    taskController.deleteTask
);

export default router;
