import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Auction, RootState } from "../types";

const auctionSlice = createSlice({
    name: "auctions",
    initialState: [] as Auction[],
    reducers: {
        createAuction(state, action) {
            return state.concat(action.payload);
        },
        setAuctions(state, action) {
            return action.payload;
        },
        deleteAuction(state, action) {
            return state.filter((auction) => auction.id !== action.payload);
        },
        updateAuction(
            state,
            action: PayloadAction<{
                updatedAuction: Auction;
            }>
        ) {
            const { updatedAuction } = action.payload;

            return state.map((auction) =>
                auction.id === updatedAuction.id ? updatedAuction : auction
            );
        },
    },
});

export const selectAuctionById = (state: RootState, auctionId: number) =>
    state.auctions.find((i) => i.id === auctionId);

export const { setAuctions, createAuction, updateAuction, deleteAuction } =
    auctionSlice.actions;
export default auctionSlice.reducer;
