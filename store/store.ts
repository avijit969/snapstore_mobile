import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import fontSlice from '../features/font/fontSlice';
import themeSlice from '../features/theme/themeSlice';
import mediaAssets from '../features/media/mediaSlice';
import albumSlice from '../features/album/albumSlice';

const rootReducer = combineReducers({
    auth: authSlice,
    fontSize: fontSlice,
    theme: themeSlice,
    media: mediaAssets,
    album: albumSlice,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
