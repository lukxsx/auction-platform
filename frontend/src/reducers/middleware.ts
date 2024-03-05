/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { setUser, clearUser } from "./user";
import { clearFavorites, addFavorite, removeFavorite } from "./favorites";

// Type guard to check if the action is of a specific type
const isSetUserAction = (action: any): action is ReturnType<typeof setUser> =>
    action.type === setUser.type;

const isClearUserAction = (
    action: any,
): action is ReturnType<typeof clearUser> => action.type === clearUser.type;

const isAddFavoriteAction = (
    action: any,
): action is ReturnType<typeof addFavorite> => action.type === addFavorite.type;

const isRemoveFavoriteAction = (
    action: any,
): action is ReturnType<typeof removeFavorite> =>
    action.type === removeFavorite.type;

const isClearFavoritesAction = (
    action: any,
): action is ReturnType<typeof clearFavorites> =>
    action.type === clearFavorites.type;

const localStorageMiddleware: Middleware =
    (store: MiddlewareAPI) => (next: any) => (action: any) => {
        if (isSetUserAction(action)) {
            const user = action.payload;
            localStorage.setItem("user", JSON.stringify(user));
        } else if (isClearUserAction(action)) {
            localStorage.removeItem("user");
        } else if (isAddFavoriteAction(action)) {
            const newFavorite = action.payload;
            const { favorites } = store.getState();
            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites.concat(newFavorite)),
            );
        } else if (isRemoveFavoriteAction(action)) {
            const favoriteToDelete = action.payload;
            const favorites = store.getState().favorites as number[];
            localStorage.setItem(
                "favorites",
                JSON.stringify(
                    favorites.filter((fav) => fav !== favoriteToDelete),
                ),
            );
        } else if (isClearFavoritesAction(action)) {
            localStorage.removeItem("favorites");
        }
        return next(action);
    };

export default localStorageMiddleware;
