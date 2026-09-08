import express from "express";
import taskRoutes from "./routes/task.routes.js";
const app = express();
app.use(express.json());
app.get("/", (_req, res) => {
    res.json({
        message: "TODO API funcionando",
    });
});
app.use("/api/tasks", taskRoutes);
export default app;
//# sourceMappingURL=app.js.map