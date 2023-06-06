/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from "express";
import * as dotenv from "dotenv";
import { Pool } from "pg";
import { Kysely, PostgresDialect, Generated } from "kysely";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: "localhost",
            database: "kysely_test",
            user: "username",
            password: "password",
        }),
    }),
});

app.get("/ping", (_req, res) => {
    console.log("ping");
    res.send("pong");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
