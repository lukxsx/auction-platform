import { db } from "../database";
import { Item, NewItem } from "../types";

const getAllItems = async (): Promise<Item[]> => {
    return await db.selectFrom("item").selectAll().execute();
};

const getAuctionItems = async (auctionId: number): Promise<Item[]> => {
    return await db
        .selectFrom("item")
        .where("auction_id", "=", auctionId)
        .selectAll()
        .execute();
};

const getItemById = async (itemId: number): Promise<Item> => {
    try {
        const item = await db
            .selectFrom("item")
            .where("id", "=", itemId)
            .selectAll()
            .executeTakeFirstOrThrow();
        return item;
    } catch (error: unknown) {
        throw new Error("item not found");
    }
};

const createItem = async (item: NewItem): Promise<Item> => {
    return await db
        .insertInto("item")
        .values(item)
        .returningAll()
        .executeTakeFirstOrThrow();
};

export default {
    getAllItems,
    getItemById,
    getAuctionItems,
    createItem,
};
