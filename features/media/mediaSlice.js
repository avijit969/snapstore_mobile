import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mergedAssets: [],
};

const mediaSlice = createSlice({
    name: "media",
    initialState,
    reducers: {
        addAssets(state, action) {
            state.mergedAssets = action.payload;
        },
        removeAllAssets(state) {
            state.mergedAssets = [];
        },
        markAssetAsBackedUp(state, action) {
            const index = action.payload.index;
            state.mergedAssets[index].isBackedUp = true;
        }
    }
});

export const { addAssets, removeAllAssets, markAssetAsBackedUp } = mediaSlice.actions;

export default mediaSlice.reducer;
