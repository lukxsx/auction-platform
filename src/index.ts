/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createServer } from "http";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import { schedule } from "node-cron";
import { createTables /*createTestData*/ } from "./database";
import userRouter from "./routes/users";
import auctionRouter from "./routes/auctions";
import bidsRouter from "./routes/bids";
import authRouter from "./routes/auth";
import { checkAuctions } from "./scheduler";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :response-time ms"));

const PORT = process.env.PORT;

export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", function () {
        console.log("Client disconnected");
    });
});

createTables()
    .then(() => console.log("tables created"))
    .catch((e) => {
        console.error(e);
    });

// createTestData()
//     .then(() => console.log("test data created"))
//     .catch((e) => console.error(e));

schedule("*/5 * * * * *", () => {
    checkAuctions()
        .then()
        .catch((e) => console.error(e));
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/bids", bidsRouter);
app.use("/api/auctions", auctionRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend")));
    app.get("*", (_req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "index.html"));
    });
}

app.use((_req, res) => {
    res.status(404).json({ error: "not found" });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
