import { createSlice } from "@reduxjs/toolkit";

interface FontState {
    font_size: number;
    isDefault: boolean;
}

const initialState: FontState = {
    font_size: 16,
    isDefault: true,
};

const fontSlice = createSlice({
    name: "fontSize",
    initialState,
    reducers: {
        increaseFontSize: (state) => {
            state.font_size += 1;
            state.isDefault = true;
        },
        decreaseFontSize: (state) => {
            state.font_size -= 1;
            state.isDefault = true;
        },
        resetFontSize: (state) => {
            state.isDefault = false;
        },
    },
});

export const { increaseFontSize, decreaseFontSize, resetFontSize } = fontSlice.actions;

export default fontSlice.reducer;
