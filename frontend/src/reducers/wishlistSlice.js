import { createSlice } from "@reduxjs/toolkit";

import Cookies from 'js-cookie';

const cookieWishlist = Cookies.get("guestWishlist");
let parsedCookieWishList = [];
try {
    parsedCookieWishList = cookieWishlist ? JSON.parse(cookieWishlist) : [];
} catch (e) {
    console.error("Failed to parse guestWishlist cookie", e);
    parsedCookieWishList = [];
}

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        // wishlist: [],
        guestWishlist: parsedCookieWishList.length ? parsedCookieWishList : [],
    },
    reducers: {
        // setWishlist: (state, action) => {
        //     state.wishlist = action.payload;
        //     state.wishCount = action.payload.length;
        // },
        // clearWishlist: (state) => {
        //     state.wishlist = [];
        // },
        setGuestWishlist: (state, action) => {
            state.guestWishlist = action.payload;
        },
        clearGuestWishlist: (state) => {
            state.guestWishlist = [];
        },
        addToGuestWishlist: (state, action) => {
            state.guestWishlist.unshift(action.payload);
            // state.wishCount = state.guestWishlist.length;
        },
        removeFromGuestWishlist: (state, action) => {
            state.guestWishlist = state.guestWishlist.filter(item => item.id !== action.payload);
            // state.wishCount = state.guestWishlist.length;
        },
    },
});

export const wishlist = (state) => state.wishlist.wishlist;

export const guestWishlist = (state) => state.wishlist.guestWishlist;

export const {
    setWishlist, clearWishlist, setGuestWishlist, clearGuestWishlist, addToGuestWishlist, removeFromGuestWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;