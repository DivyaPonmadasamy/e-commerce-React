import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        isLoggedIn: false,
        user: {
            id: null,
            email: '',
        },
        rememberUser: false,
    },
    reducers: {
        setLoggedIn: (state) => {
            state.isLoggedIn = true;
        },
        setLoggedOut: (state) => {
            state.isLoggedIn = false;
            state.user = { id: null, email: '' }; // reset user
        },
        setUser: (state, action) => {
            if (action.payload) {
                state.user.id = action.payload.id;
                state.user.email = action.payload.email;
            } else state.user = { id: null, email: '' };
        },
        setRememberUser: (state) => {
            state.rememberUser = true;
        },
        clearRememberUser: (state) => {
            state.rememberUser = false;
        },
    },
});

export const isLoggedIn = (state) => state.login.isLoggedIn;

export const user = (state) => state.login.user;

export const rememberUser = (state) => state.login.rememberUser;

export const {
    setLoggedIn, setLoggedOut, setUser, setRememberUser, clearRememberUser,
} = loginSlice.actions;

export default loginSlice.reducer;