import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./store";
import { AlertProvider } from "./contexts/AlertContext";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
//import "normalize.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={store}>
        <AlertProvider>
            <Router>
                <App />
            </Router>
        </AlertProvider>
    </Provider>
);
