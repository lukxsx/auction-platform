import { configureStore } from "@reduxjs/toolkit";
import auctionReducer from "./reducers/auctions";
import itemReducer from "./reducers/items";
import userReducer from "./reducers/user";
import localStorageMiddleware from "./reducers/middleware";

export const store = configureStore({
    reducer: {
        auctions: auctionReducer,
        items: itemReducer,
        user: userReducer,
    },
    middleware: [localStorageMiddleware],
});
