/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from "express";
import * as dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database } from "./database";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        }),
    }),
});

const demo = async () => {
    await db.schema
        .createTable("user")
        .ifNotExists()
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("name", "varchar(50)")
        .execute();
    const { id } = await db
        .insertInto("user")
        .values({ name: "asd" })
        .returning("id")
        .executeTakeFirstOrThrow();
    console.log("Added user with id", id);

    const user = await db.selectFrom("user").selectAll().executeTakeFirst();

    if (user) {
        console.log(user);
    }
};

app.get("/ping", (_req, res) => {
    console.log("ping");
    res.send("pong");
});

const start = async () => {
    await demo();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start()
    .then(() => {
        console.log("Exiting");
    })
    .catch((error) => console.error(error));
