import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../types";

const favoriteSlicer = createSlice({
    name: "favorites",
    initialState:
        (JSON.parse(localStorage.getItem("favorites") || "null") as number[]) ||
        ([] as RootState["favorites"]),
    reducers: {
        setFavorites: (state, action) => {
            return action.payload;
        },
        clearFavorites: (state) => {
            return [];
        },
        addFavorite: (state, action) => {
            return state.concat(action.payload);
        },
        removeFavorite: (state, action) => {
            return state.filter((id) => id !== action.payload);
        },
    },
});

export const { setFavorites, clearFavorites, addFavorite, removeFavorite } =
    favoriteSlicer.actions;
export default favoriteSlicer.reducer;
