import { db } from "../database";
import { Item, NewItem, ItemUpdate, ItemWithBids } from "../types";
import bidService from "./bids";

const getAllItems = async (): Promise<Item[]> => {
    return await db.selectFrom("item").selectAll().orderBy("id").execute();
};

const getItemsByAuction = async (auctionId: number): Promise<Item[]> => {
    return await db
        .selectFrom("item")
        .where("auction_id", "=", auctionId)
        .selectAll()
        .orderBy("id")
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

const getItemByIdWithBids = async (itemId: number): Promise<ItemWithBids> => {
    try {
        const item = await db
            .selectFrom("item")
            .where("id", "=", itemId)
            .selectAll()
            .executeTakeFirstOrThrow();
        // Get bids
        const bids = await bidService.getBidsByItem(item.id);
        return { ...item, bids };
    } catch (error: unknown) {
        throw new Error("item not found");
    }
};

const updateItem = async (itemId: number, updateWith: ItemUpdate) => {
    await db
        .updateTable("item")
        .set(updateWith)
        .where("id", "=", itemId)
        .executeTakeFirstOrThrow();
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
    getItemByIdWithBids,
    getItemsByAuction,
    updateItem,
    createItem,
};
