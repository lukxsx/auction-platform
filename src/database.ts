/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./types";

const dialect = new PostgresDialect({
    pool: new Pool({
        host: "localhost",
        database: "kysely_test",
        user: "username",
        password: "password",
    }),
});

// Kysely instance for queries
export const db = new Kysely<Database>({
    dialect,
});

export const createTables = async () => {
    await db.schema
        .createTable("user")
        .ifNotExists()
        .addColumn("id", "serial", (cb) => cb.primaryKey())
        .addColumn("username(64)", "varchar", (cb) => cb.notNull())
        .execute();

    await db.schema
        .createTable("item")
        .ifNotExists()
        .addColumn("id", "serial", (cb) => cb.primaryKey())
        .addColumn("model", "varchar(255)", (cb) => cb.notNull())
        .addColumn("make", "varchar(255)", (cb) => cb.notNull())
        .addColumn("info", "varchar(2048)")
        .addColumn("starting_price", "integer", (cb) => cb.notNull())
        .execute();

    await db.schema
        .createTable("bid")
        .ifNotExists()
        .addColumn("id", "serial", (cb) => cb.primaryKey())
        .addColumn("user_id", "integer", (cb) => cb.notNull())
        .addColumn("item_id", "integer", (cb) => cb.notNull())
        .execute();
};
