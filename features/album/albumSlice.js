import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    albums: [],
    albumsPhoto: [],
};

const albumSlice = createSlice({
    name: 'album',
    initialState,
    reducers: {

        addAlbums(state, action) {
            state.albums = action.payload;
        },

        addAlbumsPhoto(state, action) {
            state.albumsPhoto = action.payload;
        },
        addNewAlbum(state, action) {
            state.albums = [...state.albums, action.payload];
        }
    }
});

export const { addAlbums, addAlbumsPhoto, addNewAlbum } = albumSlice.actions;

export default albumSlice.reducer;
