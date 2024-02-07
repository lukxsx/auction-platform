import { configureStore } from "@reduxjs/toolkit";
import auctionReducer from "./reducers/auctions";
import itemReducer from "./reducers/items";
import userReducer from "./reducers/user";
import notificationReducer from "./reducers/notifications";
import localStorageMiddleware from "./reducers/middleware";
import highestBidsReducer from "./reducers/highestBids";
import favoriteReducer from "./reducers/favorites";

export const store = configureStore({
    reducer: {
        auctions: auctionReducer,
        items: itemReducer,
        user: userReducer,
        notifications: notificationReducer,
        highestBids: highestBidsReducer,
        favorites: favoriteReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(localStorageMiddleware);
    },
});
