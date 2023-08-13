import auctionService from "./services/auctions";
import itemService from "./services/items";
import bidService from "./services/bids";
import { AuctionState, Bid, ItemState, DateState } from "./types";
import { checkDate, checkDateWithState } from "./utils/helpers";

const underMinuteSinceLastBid = (lastBid: Bid) => {
    const currentDate = new Date();
    const timeDifference = Math.abs(
        currentDate.getTime() - lastBid.created_at.getTime()
    );
    const timeDifferenceInMinutes = timeDifference / (1000 * 60);

    return timeDifferenceInMinutes <= 1;
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
                } else if (dateRange == DateState.Late) {
                    // Auction is expired, but is marked pending. Setting auction as finished
                    console.log("Setting auction", a.name, "as finished");
                    a.state = AuctionState.Finished;
                    await auctionService.updateAuction(a.id, a);
                }
            } else if (a.state == AuctionState.Running) {
                console.log("Auction", a.name, "is running");
                // Running
                // Check all items if end_time has passed
                if (!checkDate(a.start_date, a.end_date)) {
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
                                await itemService.updateItem(i.id, i);
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
                                await itemService.updateItem(i.id, i);
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
                    if (items.length >= nclosed) {
                        // All items are sold or not sold, but auction is no longer running
                        // Stop the auction
                        a.state = AuctionState.Finished;
                        await auctionService.updateAuction(a.id, a);
                    }
                }
            } else {
                // Finished, do nothing
            }
        });
    } catch (error) {
        console.error("Error checking auctions");
        throw error;
    }
};
