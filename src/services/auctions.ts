import { db } from "../database";
import { Auction, NewAuction } from "../types";

const getAuctions = async (): Promise<Auction[]> => {
    return await db.selectFrom("auction").selectAll().execute();
};

const getAuctionById = async (auctionId: number): Promise<Auction> => {
    try {
        const item = await db
            .selectFrom("auction")
            .where("id", "=", auctionId)
            .selectAll()
            .executeTakeFirstOrThrow();
        return item;
    } catch (error: unknown) {
        throw new Error("auction not found");
    }
};

const createAuction = async (auction: NewAuction): Promise<Auction> => {
    return await db
        .insertInto("auction")
        .values(auction)
        .returningAll()
        .executeTakeFirstOrThrow();
};

export default {
    getAuctions,
    getAuctionById,
    createAuction,
};
