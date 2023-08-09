/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from "express";
import * as dotenv from "dotenv";
import { createTables } from "./db/schema";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

createTables()
    .then(() => console.log("tables created"))
    .catch((e) => {
        console.error(e);
    });

app.get("/ping", (_req, res) => {
    console.log("ping");
    res.send("pong");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
