import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import auctionReducer from "./reducers/auctions";
import itemReducer from "./reducers/items";
import userReducer from "./reducers/user";
import localStorageMiddleware from "./reducers/middleware";

import "bootstrap/dist/css/bootstrap.min.css";
import { NotificationProvider } from "./contexts/NotificationContext";
//import "normalize.css";

const store = configureStore({
    reducer: {
        auctions: auctionReducer,
        items: itemReducer,
        user: userReducer,
    },
    middleware: [localStorageMiddleware],
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <NotificationProvider>
                <Router>
                    <App />
                </Router>
            </NotificationProvider>
        </Provider>
    </React.StrictMode>
);
