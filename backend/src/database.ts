/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AuctionState, Database, ItemState } from "./types";
import { Kysely, PostgresDialect, sql } from "kysely";
import { DATABASE_CREDENTIALS } from "./utils/config";
import { Pool } from "pg";

const dialect = new PostgresDialect({
    pool: new Pool(DATABASE_CREDENTIALS),
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
        .addColumn("state", "varchar(16)", (cb) => cb.notNull())
        .execute();

    await db.schema
        .createTable("item")
        .ifNotExists()
        .addColumn("id", "serial", (cb) => cb.primaryKey())
        .addColumn("model", "varchar(255)", (cb) => cb.notNull())
        .addColumn("make", "varchar(255)", (cb) => cb.notNull())
        .addColumn("code", "varchar(64)")
        .addColumn("info", "varchar(2048)")
        .addColumn("auction_id", "integer", (cb) => cb.notNull())
        .addColumn("starting_price", "integer", (cb) => cb.notNull())
        .addColumn("current_price", "integer", (cb) => cb.notNull())
        .addColumn("winner_id", "integer")
        .addColumn("winner_name", "varchar(64)")
        .addColumn("state", "varchar(16)", (cb) => cb.notNull())
        .addColumn("image_filename", "varchar(255)")
        .addForeignKeyConstraint(
            "auction_id_fk",
            ["auction_id"],
            "auction",
            ["id"],
            (cb) => cb.onDelete("cascade")
        )
        .addForeignKeyConstraint(
            "winner_id_fk",
            ["winner_id"],
            "user",
            ["id"],
            (cb) => cb.onDelete("set null")
        )
        .execute();

    await db.schema
        .createTable("bid")
        .ifNotExists()
        .addColumn("id", "serial", (cb) => cb.primaryKey())
        .addColumn("price", "integer", (cb) => cb.notNull())
        .addColumn("username", "varchar(64)")
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

export const createTestData = async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const old = new Date(today);
    old.setDate(today.getDate() - 5);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const future = new Date(today);
    future.setDate(today.getDate() + 5);

    await db.insertInto("user").values({ name: "user1" }).execute();
    await db.insertInto("user").values({ name: "user2" }).execute();

    await db
        .insertInto("auction")
        .values({
            name: "current",
            start_date: today,
            end_date: tomorrow,
            state: AuctionState.Pending,
        })
        .execute();
    await db
        .insertInto("auction")
        .values({
            name: "old",
            start_date: old,
            end_date: yesterday,
            state: AuctionState.Pending,
        })
        .execute();
    await db
        .insertInto("auction")
        .values({
            name: "upcoming",
            start_date: tomorrow,
            end_date: future,
            state: AuctionState.Pending,
        })
        .execute();

    await db
        .insertInto("item")
        .values({
            model: "MacBook Pro",
            make: "Apple",
            code: "m01",
            info: "",
            starting_price: 5,
            current_price: 5,
            auction_id: 1,
            state: ItemState.Open,
        })
        .execute();

    await db
        .insertInto("item")
        .values({
            model: "MacBook Air",
            make: "Apple",
            code: "m02",
            info: "",
            starting_price: 3,
            current_price: 3,
            auction_id: 1,
            state: ItemState.Open,
        })
        .execute();

    await db
        .insertInto("item")
        .values({
            model: "iPhone 5",
            make: "Apple",
            code: "i01",
            info: "",
            starting_price: 5,
            current_price: 5,
            auction_id: 2,
            state: ItemState.Open,
        })
        .execute();

    await db
        .insertInto("item")
        .values({
            model: "One",
            make: "OnePlus",
            code: "a01",
            info: "",
            starting_price: 3,
            current_price: 3,
            auction_id: 2,
            state: ItemState.Open,
        })
        .execute();

    await db
        .insertInto("item")
        .values({
            model: "ThinkPad T42",
            make: "IBM",
            code: "t42",
            info: "",
            starting_price: 5,
            current_price: 5,
            auction_id: 3,
            state: ItemState.Open,
        })
        .execute();

    await db
        .insertInto("item")
        .values({
            model: "ThinkPad T60",
            make: "Lenovo",
            info: "",
            code: "t60",
            starting_price: 3,
            current_price: 3,
            auction_id: 3,
            state: ItemState.Open,
        })
        .execute();
};
