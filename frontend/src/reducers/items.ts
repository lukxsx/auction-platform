import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
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

//export const selectItemsByAuctionId = (state: RootState, auctionId: number) =>
//state.items.itemsByAuctionId[auctionId] || [];

const selectAuctionItems = (state: RootState) => state.items.itemsByAuctionId;
export const selectItemsByAuctionId = createSelector(
    [selectAuctionItems, (_state: RootState, auctionId: number) => auctionId],
    (itemsByAuctionId, auctionId) => itemsByAuctionId[auctionId] || []
);
