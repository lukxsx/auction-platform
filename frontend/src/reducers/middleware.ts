import {
    Middleware,
    MiddlewareAPI,
    Dispatch,
    AnyAction,
} from "@reduxjs/toolkit";
import { setUser, clearUser } from "./user";

const localStorageMiddleware: Middleware =
    (store: MiddlewareAPI) =>
    (next: Dispatch<AnyAction>) =>
    (action: AnyAction) => {
        if (action.type === setUser.type) {
            const user = action.payload;
            localStorage.setItem("user", JSON.stringify(user));
        } else if (action.type === clearUser.type) {
            localStorage.removeItem("user");
        }

        return next(action);
    };

export default localStorageMiddleware;
