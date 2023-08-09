import { db } from "../database";
import { Bid, NewBid } from "../types";

const getBids = async (): Promise<Bid[]> => {
    return await db.selectFrom("bid").selectAll().execute();
};

const createBid = async (bid: NewBid) => {
    return await db
        .insertInto("bid")
        .values(bid)
        .returningAll()
        .executeTakeFirstOrThrow();
};

export default {
    getBids,
    createBid,
};
