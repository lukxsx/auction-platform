import auctionService from "./services/auctions";
import itemService from "./services/items";
import bidService from "./services/bids";
import {
    AuctionState,
    Bid,
    ItemState,
    DateState,
    Item,
    ItemWithBids,
} from "./types";
import { checkDateWithState } from "./utils/helpers";
import { io } from "./index";

const underMinuteSinceLastBid = (lastBid: Bid) => {
    const currentDate = new Date();
    const timeDifference = Math.abs(
        currentDate.getTime() - lastBid.created_at.getTime()
    );
    const timeDifferenceInMinutes = timeDifference / (1000 * 60);

    return timeDifferenceInMinutes <= 1;
};

const toItemWithoutBids = (i: ItemWithBids): Item => {
    return {
        id: i.id,
        make: i.make,
        model: i.model,
        code: i.code,
        info: i.info,
        auction_id: i.auction_id,
        state: i.state,
        starting_price: i.starting_price,
        current_price: i.current_price,
        winner_id: i.winner_id,
        winner_name: i.winner_name,
    };
};

export const checkAuctions = async () => {
    try {
        const auctions = await auctionService.getAuctions();
        auctions.forEach(async (a) => {
            const dateRange = checkDateWithState(a.start_date, a.end_date);
            if (a.state == AuctionState.Pending) {
                // Pending
                // Check if auction can be started
                if (dateRange == DateState.Ok) {
                    console.log("Starting auction", a.name);
                    a.state = AuctionState.Running;
                    await auctionService.updateAuction(a.id, a);
                    io.emit("auction:update", a);
                } else if (dateRange == DateState.Late) {
                    // Auction is expired, but is marked pending. Setting auction as finished
                    console.log("Setting auction", a.name, "as finished");
                    a.state = AuctionState.Finished;
                    await auctionService.updateAuction(a.id, a);
                    io.emit("auction:update", a);
                }
            } else if (a.state == AuctionState.Running) {
                console.log("Auction", a.name, "is running");
                // Running
                // Check all items if end_time has passed
                if (dateRange == DateState.Late) {
                    console.log(
                        "Auction",
                        a.name,
                        "end time has passed, checking items"
                    );
                    // Get auction items
                    const items = await itemService.getItemsByAuction(a.id);
                    let nclosed = 0;
                    items.forEach(async (i) => {
                        // Check if item state is still open
                        if (i.state == ItemState.Open) {
                            console.log(
                                "Item",
                                i.id,
                                i.model,
                                "is still open, checking it's bids"
                            );
                            // Get bids of an item
                            const bids = await bidService.getBidsByItem(i.id);

                            // Are there any bids? If not, close the item
                            if (bids.length == 0) {
                                console.log(
                                    "  The item has no bids, let's mark it as unsold"
                                );
                                i.state = ItemState.Unsold;
                                await itemService.updateItem(
                                    i.id,
                                    toItemWithoutBids(i)
                                );
                                io.emit("item:update", i);
                                nclosed++;
                                return;
                            }

                            // Check if there has been a bid during the last minute
                            if (
                                !underMinuteSinceLastBid(bids[bids.length - 1])
                            ) {
                                console.log(
                                    "  There hasn't been any bids in the last minute, let's mark this as sold"
                                );
                                i.state = ItemState.Sold;

                                await itemService.updateItem(
                                    i.id,
                                    toItemWithoutBids(i)
                                );
                                io.emit("item:update", i);
                                nclosed++;
                                return;
                            } else {
                                console.log(
                                    "  There has been a bid in one minute, let's wait if there will be any more bids"
                                );
                            }
                        } else {
                            console.log("Item", i.id, i.model, "has is closed");
                            nclosed++;
                        }
                    });
                    if (nclosed >= items.length) {
                        console.log("All items are closed");
                        // All items are sold or not sold, but auction is no longer running
                        // Stop the auction
                        a.state = AuctionState.Finished;
                        await auctionService.updateAuction(a.id, a);
                        io.emit("auction:update", a);
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error checking auctions");
        throw error;
    }
};
