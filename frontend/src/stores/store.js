import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "../reducers/headerSlice";
import loginReducer from "../reducers/loginSlice";
import productReducer from "../reducers/productSlice";
import cartReducer from "../reducers/cartSlice";
import wishlistReducer from "../reducers/wishlistSlice";

export default configureStore({
    reducer: {
        header: headerReducer,
        login: loginReducer,
        product: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    }
})