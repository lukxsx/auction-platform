import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../types";

const favoriteSlicer = createSlice({
    name: "favorites",
    initialState:
        (JSON.parse(localStorage.getItem("favorites") || "null") as number[]) ||
        ([] as RootState["favorites"]),
    reducers: {
        setFavorites: (_state, action) => {
            return action.payload;
        },
        clearFavorites: (_state) => {
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
