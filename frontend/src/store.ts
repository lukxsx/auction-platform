import { configureStore } from "@reduxjs/toolkit";
import auctionReducer from "./reducers/auctions";
import itemReducer from "./reducers/items";
import userReducer from "./reducers/user";
import notificationReducer from "./reducers/notifications";
import localStorageMiddleware from "./reducers/middleware";
import biddedItemsReducer from "./reducers/highestBids";

export const store = configureStore({
    reducer: {
        auctions: auctionReducer,
        items: itemReducer,
        user: userReducer,
        notifications: notificationReducer,
        biddedItems: biddedItemsReducer,
    },
    middleware: [localStorageMiddleware],
});
