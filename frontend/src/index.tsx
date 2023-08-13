import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import auctionReducer from "./reducers/auctions";
import itemReducer from "./reducers/items";

import "bootstrap/dist/css/bootstrap.min.css";
//import "normalize.css";

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
        <Router>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    </React.StrictMode>
);
