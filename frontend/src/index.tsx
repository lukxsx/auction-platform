import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./store";
import { AlertProvider } from "./contexts/AlertContext";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import { LightboxProvider } from "./contexts/LightboxContext";
//import "normalize.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={store}>
        <AlertProvider>
            <LightboxProvider>
                <Router>
                    <App />
                </Router>
            </LightboxProvider>
        </AlertProvider>
    </Provider>
);
