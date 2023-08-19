import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../types";

const favoriteSlicer = createSlice({
    name: "favorites",
    initialState:
        JSON.parse(localStorage.getItem("favorites") || "null") ||
        ([] as RootState["favorites"]),
    reducers: {
        setFavorites: (state, action) => {
            return action.payload;
        },
        clearFavorites: (state) => {
            return [];
        },
        addFavorite: (state, action) => {
            console.log("yes I'm adding");
            state = state.concat(action.payload);
        },
        deleteFavorite: (state: RootState, action) => {
            return state.favorites.filter((id) => id !== action.payload);
        },
    },
});

export const { setFavorites, clearFavorites, addFavorite } =
    favoriteSlicer.actions;
export default favoriteSlicer.reducer;
