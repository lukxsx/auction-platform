import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "../types";

const notificationSlice = createSlice({
    name: "notifications",
    initialState: [] as Notification[],
    reducers: {
        addNotification: (state, action) => {
            state.push({
                id: Date.now(),
                ...action.payload,
                show: true,
            });
        },
        removeNotification: (state, action) => {
            const notification = state.find((n) => n.id === action.payload);
            if (notification)
                return state.filter((n) => n.id !== notification.id);
        },
    },
});

export const { addNotification, removeNotification } =
    notificationSlice.actions;

export default notificationSlice.reducer;
