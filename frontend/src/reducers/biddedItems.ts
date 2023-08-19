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
        setItems: (state, action) => {
            return action.payload;
        },
    },
});

export const { addItem, deleteItem, setItems } = biddedItemsSlice.actions;
export default biddedItemsSlice.reducer;
