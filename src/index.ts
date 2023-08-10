/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";
import { createTables /*createTestData*/ } from "./database";
import userRouter from "./routes/users";
import auctionRouter from "./routes/auctions";
import bidsRouter from "./routes/bids";
import authRouter from "./routes/auth";

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan(":method :url :status :response-time ms"));

const PORT = process.env.PORT;

createTables()
    .then(() => console.log("tables created"))
    .catch((e) => {
        console.error(e);
    });

// createTestData()
//     .then(() => console.log("test data created"))
//     .catch((e) => console.error(e));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/bids", bidsRouter);
app.use("/api/auctions", auctionRouter);

app.get("/ping", (_req, res) => {
    res.send("pong");
});

app.use((_req, res) => {
    res.status(404).json({ error: "not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
