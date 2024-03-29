import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { Item, RootState } from "../types";

const itemsSlice = createSlice({
    name: "items",
    initialState: [] as Item[],
    reducers: {
        setItems(_state, action) {
            return action.payload;
        },
        addItem(state, action) {
            return state.concat(action.payload);
        },
        deleteItem(state, action) {
            return state.filter((item) => item.id !== action.payload);
        },
        updateItem(
            state,
            action: PayloadAction<{
                itemId: number;
                updatedItem: Item;
            }>,
        ) {
            const { itemId, updatedItem } = action.payload;

            const updatedItems = state.map((item) =>
                item.id === itemId ? updatedItem : item,
            );
            return updatedItems;
        },
    },
});

export const { setItems, updateItem, addItem, deleteItem } = itemsSlice.actions;
export default itemsSlice.reducer;

//export const selectItemsByAuctionId = (state: RootState, auctionId: number) =>
//state.items.itemsByAuctionId[auctionId] || [];

const selectItems = (state: RootState) => state.items;

export const selectItemsByAuctionId = (auctionId: number) =>
    createSelector([selectItems], (items) =>
        items.filter((item) => item.auction_id === auctionId),
    );
