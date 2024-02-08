/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import auctionRouter from "./routes/auctions";
import authRouter from "./routes/auth";
import bidsRouter from "./routes/bids";
import { checkAuctions } from "./scheduler";
import cors from "cors";
import { createServer } from "http";
import { createTables /*createTestData*/ } from "./database";
import express from "express";
import imageRouter from "./routes/images";
import reportRouter from "./routes/reports";
import morgan from "morgan";
import path from "path";
import { schedule } from "node-cron";
import userRouter from "./routes/users";
import testingRouter from "./routes/tests";
import { createUsers } from "./utils/testdata";

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
    .then(() => console.log("Tables created"))
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

app.set("view engine", "ejs");
app.set("views", __dirname + "/templates");

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/bids", bidsRouter);
app.use("/api/auctions", auctionRouter);
app.use("/api/images", imageRouter);
app.use("/api/reports", reportRouter);

// If in testing mode, enable testing route
if (process.env.NODE_ENV === "test") {
    app.use("/api/testing", testingRouter);
    createUsers()
        .then(() => console.log("Test users created"))
        .catch(() => {});
}

// Serve frontend from backend if production
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
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
