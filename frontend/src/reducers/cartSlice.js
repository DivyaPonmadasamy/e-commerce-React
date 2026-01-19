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

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        products: [],
        cart: [],
        guestCart: parsedCookieCart.length ? parsedCookieCart : [],
        addMore: {
            show: false,
            name: '',
            quantity: 0,
            unit: '',
            item: {}
        },
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        addToGuestCart: (state, action) => {
            const { id, quantity, name, url, mrp, discount } = action.payload;
            const existing = state.guestCart.find(item => item.id === id);

            if (existing) {
                existing.quantity += quantity;

                // move item to top
                state.guestCart = [
                    existing,
                    ...state.guestCart.filter(i => i.id !== id)
                ];
            } else state.guestCart.unshift({ id, quantity, name, url, mrp, discount, productid: id });
        },
        incrementGuestCart: (state, action) => {
            const { id } = action.payload;

            const existing = state.guestCart.find(item => item.id === id);
            if (existing) existing.quantity += 1;
        },
        decrementGuestCart: (state, action) => {
            const { id } = action.payload;

            const existing = state.guestCart.find(item => item.id === id);
            if (existing && existing.quantity > 0) existing.quantity -= 1;
        },
        removeFromGuestCart: (state, action) => {
            state.guestCart = state.guestCart.filter(item => item.id !== action.payload);
        },
        clearGuestCart: (state) => {
            state.guestCart = [];
        },
        clearOrderedQuantities: (state) => {
            state.products = state.products.map(p => ({
                ...p,
                orderedquantity: 0
            }));
        },
        updateAddMore: (state, action) => {
            return {
                ...state, addMore: {
                    ...state.addMore,
                    show: action.payload.show,
                    name: action.payload.name,
                    quantity: action.payload.quantity,
                    unit: action.payload.unit,
                    item: action.payload.item
                }
            }
        }
    },
});

export const products = (state) => state.cart.products;

export const cart = (state) => state.cart.cart;

export const guestCart = (state) => state.cart.guestCart;

export const addMore = (state) => state.cart.addMore;

export const {
    setProducts, setCart, addToGuestCart, incrementGuestCart, decrementGuestCart,
    removeFromGuestCart, clearGuestCart, clearOrderedQuantities, updateAddMore,
} = cartSlice.actions;

export default cartSlice.reducer;