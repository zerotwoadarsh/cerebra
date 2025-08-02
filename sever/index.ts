import dotenv from 'dotenv';
dotenv.config();

import cluster from 'cluster';
import os from 'os';
import express from "express";
import { ContentModel, LinkModel, UserModel } from "./src/db";
import { JWT_PASSWORD, frontendUrl } from "./src/config";
import { userMiddleware } from "./src/middleware";
import cors from "cors";
import { Signin, Signup } from "./src/routes/auth";
import { DeleteContent, GetContent, PostContent, PutContent } from "./src/routes/content";
import { GetShareBrain, PostShareBrain } from "./src/routes/brain";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Spawning a new one...`);
        cluster.fork();
    });
} else {
    const app = express();
    app.use(express.json());

    // --- FIX IS HERE ---
    // Add your local development URL to the list of allowed origins.
    const allowedOrigins = ["https://cerebra-brown.vercel.app", "http://localhost:5173"];

    app.use(
        cors({
            origin: function (origin, callback) {
                // allow requests with no origin (like mobile apps or curl requests)
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
                    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        })
    );

    app.get("/", (req, res) => {
        res.json({
            message: `Brainly backend process: ${process.pid}`
        });
    });

    app.post("/api/v1/signup", Signup);
    app.post("/api/v1/signin", Signin);
    app.post("/api/v1/content", userMiddleware, PostContent);
    app.get("/api/v1/content", userMiddleware, GetContent);
    app.put("/api/v1/content", userMiddleware, PutContent);
    app.delete("/api/v1/content", userMiddleware, DeleteContent)
    app.post("/api/v1/brain/share", userMiddleware, PostShareBrain);
    app.get("/api/v1/brain/:shareLink", GetShareBrain);

    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started and listening on port 3000`);
    });
}
