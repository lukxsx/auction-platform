import { db } from "../database";
import { Auction, NewAuction } from "../types";

const getAuctions = async (): Promise<Auction[]> => {
    return await db.selectFrom("auction").selectAll().execute();
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
    createAuction,
};
