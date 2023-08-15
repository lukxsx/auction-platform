/* eslint-disable import/no-anonymous-default-export */
import { io, Socket } from "socket.io-client";
import { store } from "../store";
import { updateItem } from "../reducers/items";
import { Item } from "../types";

class SocketService {
    private socket: Socket | null = null;

    connect() {
        this.socket = io("http://localhost:3001");
        this.setupListeners();
    }

    private setupListeners() {
        if (this.socket) {
            this.socket.on("item:update", (updatedItem: Item) => {
                console.log("Received item");
                console.log(updatedItem);
                store.dispatch(
                    updateItem({
                        auctionId: updatedItem.auction_id,
                        itemId: updatedItem.id,
                        newItem: updatedItem,
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
