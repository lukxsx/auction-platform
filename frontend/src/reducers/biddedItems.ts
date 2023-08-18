import { createSlice } from "@reduxjs/toolkit";

const biddedItemsSlice = createSlice({
    name: "biddedItems",
    initialState: [] as number[],
    reducers: {
        addItem: (state, action) => {
            return state.concat(action.payload);
        },
        deleteItem: (state, action) => {
            return state.filter((i) => i !== action.payload);
        },
    },
});

export const { addItem, deleteItem } = biddedItemsSlice.actions;
export default biddedItemsSlice.reducer;
