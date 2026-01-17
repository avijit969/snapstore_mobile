import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Asset {
    id: string;
    isBackedUp?: boolean;
    uploadProgress?: boolean;
    [key: string]: any;
}

interface MediaState {
    mergedAssets: Asset[];
    remoteAssets: any[];
}

const initialState: MediaState = {
    mergedAssets: [],
    remoteAssets: [],
};

const mediaSlice = createSlice({
    name: "media",
    initialState,
    reducers: {
        addAssets(state, action: PayloadAction<Asset[]>) {
            state.mergedAssets = action.payload;
        },
        removeAllAssets(state) {
            state.mergedAssets = [];
        },
        markAssetAsBackedUp(state, action: PayloadAction<{ index: number; _id?: string }>) {
            const { index, _id } = action.payload;
            if (state.mergedAssets[index]) {
                state.mergedAssets[index].isBackedUp = true;
                if (_id) {
                    state.mergedAssets[index]._id = _id;
                }
            }
        },
        markUploadProgress(state, action: PayloadAction<{ index: number }>) {
            const index = action.payload.index
            if (state.mergedAssets[index]) {
                state.mergedAssets[index].uploadProgress = true;
            }
        },
        addRemoteAssets(state, action: PayloadAction<any[]>) {
            state.remoteAssets = action.payload;
        },
        removeAParticularAsset(state, action: PayloadAction<number>) {
            const index = action.payload;
            state.mergedAssets.splice(index, 1);
        }
    }
});

export const { addAssets, removeAllAssets, markAssetAsBackedUp, markUploadProgress, addRemoteAssets, removeAParticularAsset } = mediaSlice.actions;

export default mediaSlice.reducer;
