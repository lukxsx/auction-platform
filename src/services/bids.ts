import { db } from "../database";
import { Bid, NewBid } from "../types";
import auctionService from "./auctions";
import itemService from "./items";
import { checkDate } from "../utils/helpers";

const getBids = async (): Promise<Bid[]> => {
    return await db.selectFrom("bid").selectAll().execute();
};

const getBidsByItem = async (itemId: number): Promise<Bid[]> => {
    return await db
        .selectFrom("bid")
        .where("item_id", "=", itemId)
        .selectAll()
        .execute();
};

const bidOnItem = async (
    bidValue: number,
    userId: number,
    auctionId: number,
    itemId: number
): Promise<Bid> => {
    try {
        // Get auction details
        const auction = await auctionService.getAuctionById(auctionId);

        // Check if auction is ongoing
        if (!checkDate(auction.start_date, auction.end_date)) {
            throw new Error("Auction is not running at the moment");
        }

        // Get item details
        const item = await itemService.getItemById(itemId);

        // Compare prices
        if (bidValue < item.current_price && bidValue < item.starting_price) {
            throw new Error("Bid is too low");
        }

        // Update new price on item entry
        item.current_price = bidValue;
        await itemService.updateItem(itemId, item);

        // Create bid entry
        const newBid = await createBid({
            price: bidValue,
            user_id: userId,
            item_id: itemId,
            auction_id: auctionId,
        });

        return newBid;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error();
    }
};

const createBid = async (bid: NewBid): Promise<Bid> => {
    return await db
        .insertInto("bid")
        .values(bid)
        .returningAll()
        .executeTakeFirstOrThrow();
};

export default {
    getBids,
    getBidsByItem,
    bidOnItem,
    createBid,
};
