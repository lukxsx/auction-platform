/* eslint-disable import/no-anonymous-default-export */
import { io, Socket } from "socket.io-client";
import { store } from "../store";
import { updateItem } from "../reducers/items";
import { updateAuction } from "../reducers/auctions";
import { Auction, AuctionState, Item } from "../types";
import { addNotification } from "../reducers/notifications";

class SocketService {
    private socket: Socket | null = null;

    connect() {
        this.socket = io("http://localhost:3001");
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
            this.socket.on("auction:update", (auction: Auction) => {
                auction.start_date = new Date(auction.start_date);
                auction.end_date = new Date(auction.end_date);
                if (auction.state === AuctionState.Finished) {
                    store.dispatch(
                        addNotification({
                            title: "Info",
                            message:
                                "Auction " + auction.name + " has finished!",
                            variant: "success",
                        })
                    );
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
