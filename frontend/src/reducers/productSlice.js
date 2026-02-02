import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        clearOrderedQuantities: (state) => {
            state.products = state.products.map(p => ({
                ...p,
                orderedquantity: 0
            }));
        },
    },
});

export const products = (state) => state.product.products;

export const {
    setProducts, clearOrderedQuantities,
} = productSlice.actions;

export default productSlice.reducer;