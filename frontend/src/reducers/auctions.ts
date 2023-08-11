import { createSlice } from "@reduxjs/toolkit";
import { Auction } from "../types";

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

export const { setAuctions } = auctionSlice.actions;
export default auctionSlice.reducer;
