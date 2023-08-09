/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Pool } from "pg";
import { Kysely, PostgresDialect, sql } from "kysely";
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
        .addColumn("name", "varchar(64)", (cb) => cb.notNull())
        .execute();

    await db.schema
        .createTable("auction")
        .ifNotExists()
        .addColumn("id", "serial", (cb) => cb.primaryKey())
        .addColumn("name", "varchar(255)", (cb) => cb.notNull())
        .addColumn("start_date", "timestamp", (cb) => cb.notNull())
        .addColumn("end_date", "timestamp", (cb) => cb.notNull())
        .execute();

    await db.schema
        .createTable("item")
        .ifNotExists()
        .addColumn("id", "serial", (cb) => cb.primaryKey())
        .addColumn("model", "varchar(255)", (cb) => cb.notNull())
        .addColumn("make", "varchar(255)", (cb) => cb.notNull())
        .addColumn("info", "varchar(2048)")
        .addColumn("auction_id", "integer", (cb) => cb.notNull())
        .addColumn("starting_price", "integer", (cb) => cb.notNull())
        .addColumn("current_price", "integer", (cb) => cb.notNull())
        .addForeignKeyConstraint(
            "auction_id_fk",
            ["auction_id"],
            "auction",
            ["id"],
            (cb) => cb.onDelete("cascade")
        )
        .execute();

    await db.schema
        .createTable("bid")
        .ifNotExists()
        .addColumn("id", "serial", (cb) => cb.primaryKey())
        .addColumn("price", "integer", (cb) => cb.notNull())
        .addColumn("user_id", "integer", (cb) => cb.notNull())
        .addColumn("item_id", "integer", (cb) => cb.notNull())
        .addColumn("auction_id", "integer", (cb) => cb.notNull())
        .addColumn("created_at", "timestamp", (cb) =>
            cb.notNull().defaultTo(sql`now()`)
        )
        .addForeignKeyConstraint(
            "user_id_fk",
            ["user_id"],
            "user",
            ["id"],
            (cb) => cb.onDelete("cascade")
        )
        .addForeignKeyConstraint(
            "item_id_fk",
            ["item_id"],
            "item",
            ["id"],
            (cb) => cb.onDelete("cascade")
        )
        .addForeignKeyConstraint(
            "auction_id_fk",
            ["auction_id"],
            "auction",
            ["id"],
            (cb) => cb.onDelete("cascade")
        )
        .execute();
};
