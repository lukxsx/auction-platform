import {
    Middleware,
    MiddlewareAPI,
    Dispatch,
    AnyAction,
} from "@reduxjs/toolkit";
import { setUser, clearUser } from "./user";
import { clearFavorites, addFavorite } from "./favorites";

const localStorageMiddleware: Middleware =
    (store: MiddlewareAPI) =>
    (next: Dispatch<AnyAction>) =>
    (action: AnyAction) => {
        // Set and clear user from local storage
        if (action.type === setUser.type) {
            const user = action.payload;
            localStorage.setItem("user", JSON.stringify(user));
        } else if (action.type === clearUser.type) {
            localStorage.removeItem("user");
            // Set and clear favorites from local storage
        } else if (action.type === addFavorite.type) {
            const newFavorite = action.payload;
            const { favorites } = store.getState();
            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites.concat(newFavorite))
            );
        } else if (action.type === clearFavorites.type) {
            localStorage.removeItem("favorites");
        }

        return next(action);
    };

export default localStorageMiddleware;
