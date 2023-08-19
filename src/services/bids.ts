import { AuctionState, Bid, ItemState, ItemWithBids, NewBid } from "../types";
import auctionService from "./auctions";
import { db } from "../database";
import { io } from "../index";
import itemService from "./items";

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
        if (auction.state != AuctionState.Running) {
            throw new Error("Auction is not running at the moment");
        }

        // Get item details
        const item = await itemService.getItemByIdWithoutBids(bidEntry.item_id);

        // Check if item's auction id matches auction id
        if (bidEntry.auction_id !== item.auction_id) {
            throw new Error("This item is not part of this auction");
        }

        // Check item state
        if (item.state != ItemState.Open) {
            throw new Error("This item cannot be bidded on at the moment");
        }

        // Compare prices
        if (bidEntry.price <= item.current_price) {
            throw new Error("Bid is too low");
        }

        // Update new price and current winner on item entry
        item.current_price = bidEntry.price;
        item.winner_id = bidEntry.user_id;
        item.winner_name = bidEntry.username;
        await itemService.updateItem(bidEntry.item_id, item);

        // Create bid entry
        const newBid = await createBid(bidEntry);
        console.log(
            "New bid on item",
            item.id,
            "from user",
            newBid.user_id + ". The current price is",
            newBid.price
        );

        const itemBids = await getBidsByItem(item.id);
        const itemWithBids = item as ItemWithBids;
        itemWithBids.bids = itemBids;

        // Get full list of bids
        io.emit("item:update", itemWithBids);
        io.emit("bid:new", bidEntry);

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

const underMinuteSinceLastBid = async (itemId: number): Promise<boolean> => {
    const bids = await getBidsByItem(itemId);
    if (bids.length == 0) return false;
    const lastBid = bids[bids.length - 1];
    const currentDate = new Date();
    const timeDifference = Math.abs(
        currentDate.getTime() - lastBid.created_at.getTime()
    );
    const timeDifferenceInMinutes = timeDifference / (1000 * 60);

    return timeDifferenceInMinutes <= 1;
};

export default {
    getBids,
    getBidsByItem,
    bidOnItem,
    createBid,
    underMinuteSinceLastBid,
};
