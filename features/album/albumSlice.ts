import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Album {
    id: string;
    name: string;
    description?: string;
    [key: string]: any;
}

interface AlbumState {
    albums: Album[];
    albumsPhoto: any[];
}

const initialState: AlbumState = {
    albums: [],
    albumsPhoto: [],
};

const albumSlice = createSlice({
    name: 'album',
    initialState,
    reducers: {
        addAlbums(state, action: PayloadAction<Album[]>) {
            state.albums = action.payload;
        },
        addAlbumsPhoto(state, action: PayloadAction<any[]>) {
            state.albumsPhoto = action.payload;
        },
        addNewAlbum(state, action: PayloadAction<Album>) {
            state.albums = [...state.albums, action.payload];
        },
        removeAlbum(state, action: PayloadAction<string>) {
            state.albums = state.albums.filter(album => album._id !== action.payload);
        },
        updateAlbum(state, action: PayloadAction<Album>) {
            const index = state.albums.findIndex(album => album._id === action.payload._id);
            if (index !== -1) {
                state.albums[index] = action.payload;
            }
        }
    }
});

export const { addAlbums, addAlbumsPhoto, addNewAlbum, removeAlbum, updateAlbum } = albumSlice.actions;

export default albumSlice.reducer;
