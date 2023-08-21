/* eslint-disable import/no-anonymous-default-export */
import { io, Socket } from "socket.io-client";
import { store } from "../store";
import { updateItem } from "../reducers/items";
import { updateAuction } from "../reducers/auctions";
import {
    Auction,
    Bid,
    Item,
    ItemState,
    SocketUpdate,
    UpdateType,
} from "../types";
import { addNotification } from "../reducers/notifications";
import { SOCKET_IO_ADDR } from "../utils/config";
import { addItem, deleteItem } from "../reducers/highestBids";

// A helper function for sending notifications
const sendNotification = (
    title: string,
    message: string,
    variant: string,
    link?: string
) => {
    store.dispatch(
        addNotification({
            title,
            message,
            variant,
            link,
        })
    );
};

class SocketService {
    private socket: Socket | null = null;

    connect() {
        this.socket = io(SOCKET_IO_ADDR);
        this.setupListeners();
    }

    private setupListeners() {
        if (this.socket) {
            // Item updates
            this.socket.on("item:update", (item: Item) => {
                const { user } = store.getState();
                // Check if the item is sold and send notification for the winner
                if (
                    item.state === ItemState.Sold &&
                    user.user &&
                    user.user.id === item.winner_id
                )
                    sendNotification(
                        "Info",
                        "You won the item " + item.model + "!",
                        "info",
                        `/auction/${item.auction_id}?item=${item.id}`
                    );

                // Update Redux store with the item
                store.dispatch(
                    updateItem({
                        itemId: item.id,
                        updatedItem: item,
                    })
                );
            });

            // Bid updates
            this.socket.on("bid:new", (bid: Bid) => {
                const { user, biddedItems } = store.getState();
                // Check if someone has outbid your bid
                if (user.user && bid.username !== user.user.name) {
                    // Have I had the highest bid on this item before?
                    if (biddedItems.includes(bid.item_id)) {
                        const item = store
                            .getState()
                            .items.find((i) => i.id === bid.item_id);
                        sendNotification(
                            "Info",
                            "You have been outbid by " +
                                bid.username +
                                " on item " +
                                item?.model,
                            "info",
                            `/auction/${bid.auction_id}?item=${bid.item_id}`
                        );
                        // Delete the item for the highest bids list
                        // since you are no longer the highest bidder
                        store.dispatch(deleteItem(bid.item_id));
                    }
                }

                // It's my bid and it's the highest bid at the moment
                if (user.user && bid.username === user.user.name) {
                    // Add the item to the local highest bids list
                    store.dispatch(addItem(bid.item_id));
                }
            });

            // Listen on auction updates (auction start and end)
            this.socket.on("auction:update", (update: SocketUpdate) => {
                const auction = update.value as Auction;
                // Auction ending notification
                if (update.updateType === UpdateType.AuctionFinished) {
                    sendNotification(
                        "Info",
                        "Auction " + auction.name + " has finished!",
                        "info"
                    );
                }

                // Auction starting notification
                if (update.updateType === UpdateType.AuctionStarted) {
                    sendNotification(
                        "Info",
                        "Auction " + auction.name + " has started!",
                        "info"
                    );
                }

                // Fix auction date types
                auction.start_date = new Date(auction.start_date);
                auction.end_date = new Date(auction.end_date);

                // Update store
                store.dispatch(
                    updateAuction({
                        updatedAuction: auction,
                    })
                );
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default new SocketService();
