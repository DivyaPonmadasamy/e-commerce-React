import { createSlice } from "@reduxjs/toolkit";

import Cookies from 'js-cookie';

const cookieCart = Cookies.get('guestCart');
let parsedCookieCart = [];
try {
    parsedCookieCart = cookieCart ? JSON.parse(cookieCart) : [];
} catch (e) {
    console.error("Failed to parse guestCart cookie", e);
    parsedCookieCart = [];
}

const cookieWishlist = Cookies.get("guestWishlist");
let parsedCookieWishList = [];
try {
    parsedCookieWishList = cookieWishlist ? JSON.parse(cookieWishlist) : [];
} catch (e) {
    console.error("Failed to parse guestWishlist cookie", e);
    parsedCookieWishList = [];
}

export const headerSlice = createSlice({
    name: 'header',
    initialState: {
        cartCount: parsedCookieCart.length ? parsedCookieCart.length : 0,
        wishCount: parsedCookieWishList.length ? parsedCookieWishList.length : 0,
        showWishList: false,
        showCart: false,
        filterInput: '',
        showLogin: false,
    },
    reducers: {
        updateCartCount: (state, action) => {
            state.cartCount = action.payload;
        },
        displayCart: (state) => {
            state.showCart = true;
        },
        closeCart: (state) => {
            state.showCart = false;
        },
        updateWishCount: (state, action) => {
            state.wishCount = action.payload;
        },
        displayWishList: (state) => {
            state.showWishList = true;
        },
        closeWishList: (state) => {
            state.showWishList = false;
        },
        setSearch: (state, action) => {
            state.filterInput = action.payload;
        },
        clearSearch: (state) => {
            state.filterInput = '';
        },
        displayLogin: (state) => {
            state.showLogin = true;
        },
        closeLogin: (state) => {
            state.showLogin = false;
        },
    },
});

export const searchInput = (state) => state.header.filterInput;

export const cartCount = (state) => state.header.cartCount;

export const showCart = (state) => state.header.showCart;

export const wishCount = (state) => state.header.wishCount;

export const showWishList = (state) => state.header.showWishList;

export const showLogin = (state) => state.header.showLogin;

export const {
    updateCartCount, displayCart, closeCart,
    setSearch, clearSearch,
    updateWishCount, displayWishList, closeWishList,  
    displayLogin, closeLogin, 
} = headerSlice.actions;

export default headerSlice.reducer;