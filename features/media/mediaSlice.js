import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mergedAssets: [],
    remoteAssets: [],
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
        },
        markUploadProgress(state, action) {
            const index = action.payload.index
            state.mergedAssets[index].uploadProgress = true;
        },
        addRemoteAssets(state, action) {
            state.remoteAssets = action.payload;
        },
        removeAParticularAsset(state, action) {
            const index = action.payload;
            state.mergedAssets.splice(index, 1);
        }
    }
});

export const { addAssets, removeAllAssets, markAssetAsBackedUp, markUploadProgress, addRemoteAssets, removeAParticularAsset } = mediaSlice.actions;

export default mediaSlice.reducer;
