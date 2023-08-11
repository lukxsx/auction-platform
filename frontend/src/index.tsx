import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App";
import auctionReducer from "./reducers/auctions";
import itemReducer from "./reducers/items";

const store = configureStore({
    reducer: {
        auctions: auctionReducer,
        items: itemReducer,
    },
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
