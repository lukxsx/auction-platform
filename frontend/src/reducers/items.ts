import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item, RootState, AuctionItemsState } from "../types";

const initialState: AuctionItemsState = {
    itemsByAuctionId: {},
};

const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setItems: (
            state,
            action: PayloadAction<{ auctionId: number; items: Item[] }>
        ) => {
            const { auctionId, items } = action.payload;
            state.itemsByAuctionId[auctionId] = items;
        },
    },
});

export const { setItems } = itemsSlice.actions;
export default itemsSlice.reducer;

// Selectors
export const selectItemsByAuctionId = (state: RootState, auctionId: number) =>
    state.items.itemsByAuctionId[auctionId] || [];
