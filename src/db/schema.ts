/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Generated } from "kysely";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: "localhost",
            database: "kysely_test",
            user: "username",
            password: "password",
        }),
    }),
});

interface UserTable {
    id: Generated<number>;
    name: string;
}

interface ItemTable {
    id: Generated<number>;
    model: string;
    make: string;
    info?: string;
    starting_price: number;
}

interface BidTable {
    id: Generated<number>;
    price: number;
    user_id: number;
    item_id: number;
    time: Date;
}

interface Database {
    user: UserTable;
    item: ItemTable;
    bid: BidTable;
}

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
