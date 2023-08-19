import { createSlice } from "@reduxjs/toolkit";

// Store user's highest bids
// (or basically IDs of items where the user is the top bidder)
const highestBids = createSlice({
    name: "biddedItems",
    initialState: [] as number[],
    reducers: {
        addItem: (state, action) => {
            return state.concat(action.payload);
        },
        deleteItem: (state, action) => {
            return state.filter((i) => i !== action.payload);
        },
        setItems: (state, action) => {
            return action.payload;
        },
    },
});

export const { addItem, deleteItem, setItems } = highestBids.actions;
export default highestBids.reducer;
