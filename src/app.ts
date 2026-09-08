import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import taskRoutes
    from "./routes/task.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "TODO API funcionando",
    });
});

app.use(
    "/ui",
    express.static(path.join(__dirname, "..", "public"))
);

app.use(
    "/tasks",
    taskRoutes
);

app.use(
    "/api/tasks",
    taskRoutes
);

export default app;