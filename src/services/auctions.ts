import { db } from "../database";
import { Auction, NewAuction, AuctionUpdate } from "../types";

const getAuctions = async (): Promise<Auction[]> => {
    return await db.selectFrom("auction").selectAll().orderBy("id").execute();
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

// Update auction with new values
const updateAuction = async (auctionId: number, updateWith: AuctionUpdate) => {
    await db
        .updateTable("auction")
        .set(updateWith)
        .where("id", "=", auctionId)
        .executeTakeFirstOrThrow();
};

export default {
    getAuctions,
    getAuctionById,
    createAuction,
    updateAuction,
};
