/* eslint-disable import/no-anonymous-default-export */
import { io, Socket } from "socket.io-client";
import { store } from "../store";
import { updateItem } from "../reducers/items";
import { updateAuction } from "../reducers/auctions";
import {
    Auction,
    AuctionState,
    Bid,
    Item,
    SocketUpdate,
    UpdateType,
} from "../types";
import { addNotification } from "../reducers/notifications";
import { SOCKET_IO_ADDR } from "../utils/config";
import { addItem, deleteItem } from "../reducers/biddedItems";

const sendNotification = (title: string, message: string, variant: string) => {
    store.dispatch(
        addNotification({
            title,
            message,
            variant,
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
            this.socket.on("item:update", (item: Item) => {
                store.dispatch(
                    updateItem({
                        itemId: item.id,
                        updatedItem: item,
                    })
                );
            });

            this.socket.on("bid:new", (bid: Bid) => {
                const { user, biddedItems } = store.getState();
                if (user.user && bid.username !== user.user.name) {
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
                            ""
                        );
                        store.dispatch(deleteItem(bid.item_id));
                    }
                }

                if (user.user && bid.username === user.user.name) {
                    store.dispatch(addItem(bid.item_id));
                }
            });

            this.socket.on("auction:update", (update: SocketUpdate) => {
                const auction = update.value as Auction;
                if (update.updateType === UpdateType.AuctionFinished) {
                    sendNotification(
                        "Info",
                        "Auction " + auction.name + " has finished!",
                        ""
                    );
                }
                if (update.updateType === UpdateType.AuctionStarted) {
                    sendNotification(
                        "Info",
                        "Auction " + auction.name + " has started!",
                        ""
                    );
                }
                auction.start_date = new Date(auction.start_date);
                auction.end_date = new Date(auction.end_date);
                if (auction.state === AuctionState.Finished) {
                }
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
