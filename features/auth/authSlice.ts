import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
    [key: string]: any;
}

interface AuthState {
    status: boolean;
    userData: UserData;
}

const initialState: AuthState = {
    status: false,
    userData: {},
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserData>) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = {};
        },
        setUserData: (state, action: PayloadAction<any>) => {
            if (state.userData) {
                state.userData.user = action.payload;
            }
        },
    },
});

export const { login, logout, setUserData } = authSlice.actions;

export default authSlice.reducer;
