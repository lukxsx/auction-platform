/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from "express";
import * as dotenv from "dotenv";
import { createTables } from "./database";
import userRouter from "./routes/users";
import itemRouter from "./routes/items";
import auctionRouter from "./routes/auctions";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

createTables()
    .then(() => console.log("tables created"))
    .catch((e) => {
        console.error(e);
    });

app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);
app.use("/api/auctions", auctionRouter);

app.get("/ping", (_req, res) => {
    res.send("pong");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
