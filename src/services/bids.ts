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
        .orderBy("id")
        .execute();
};

const bidOnItem = async (bidEntry: NewBid): Promise<Bid> => {
    try {
        // Get auction details
        const auction = await auctionService.getAuctionById(
            bidEntry.auction_id
        );

        // Check if auction is ongoing
        if (!checkDate(auction.start_date, auction.end_date)) {
            throw new Error("Auction is not running at the moment");
        }

        // Get item details
        const item = await itemService.getItemById(bidEntry.item_id);

        // Check if item's auction id matches auction id
        if (bidEntry.auction_id !== item.auction_id) {
            throw new Error("This item is not part of this auction");
        }

        // Compare prices
        if (bidEntry.price <= item.current_price) {
            throw new Error("Bid is too low");
        }

        // Update new price on item entry
        item.current_price = bidEntry.price;
        await itemService.updateItem(bidEntry.item_id, item);

        // Create bid entry
        const newBid = await createBid(bidEntry);

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
