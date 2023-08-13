import { createSlice } from "@reduxjs/toolkit";
import { Auction, RootState } from "../types";

const auctionSlice = createSlice({
    name: "auctions",
    initialState: [] as Auction[],
    reducers: {
        createAuction(state, action) {
            const newAuction = action.payload;
            state.push(newAuction);
        },
        setAuctions(state, action) {
            return action.payload;
        },
    },
});

export const selectAuctionById = (state: RootState, auctionId: number) =>
    state.auctions.find((i) => i.id === auctionId);

export const { setAuctions } = auctionSlice.actions;
export default auctionSlice.reducer;
