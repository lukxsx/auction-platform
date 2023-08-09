import { db } from "../database";
import { Item, NewItem } from "../types";

const getItems = async (): Promise<Item[]> => {
    return await db.selectFrom("item").selectAll().execute();
};

const createItem = async (item: NewItem): Promise<Item> => {
    return await db
        .insertInto("item")
        .values(item)
        .returningAll()
        .executeTakeFirstOrThrow();
};

export default {
    getItems,
    createItem,
};
