import "dotenv/config";

import { connectMongo }
    from "./config/mongodb.js";

import app from "./app.js";

const PORT =
    process.env.PORT || 3000;

async function startServer() {
    try {
    await connectMongo();

    app.listen(PORT, () => {
        console.log(
        `Server running on port ${PORT}`
        );
    });
    } catch (error) {
    console.error(
        "Error starting server:",
        error
    );

    process.exit(1);
    }
}

startServer();