import '../styles/Header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Cookies from 'js-cookie';
import storeLogo from '../images/grocery-store-logo.jpg';
import shoppingCart from '../images/shopping-cart-icon.jpg';
import { useEffect, useRef, useState } from 'react';
import {
    cartCount, updateCartCount, displayCart, closeCart,
    wishCount, updateWishCount, displayWishList,
    searchInput, setSearch, clearSearch,
    displayLogin,
} from '../reducers/headerSlice';
import { isLoggedIn, setLoggedOut, setUser } from "../reducers/loginSlice";
import { setCart, clearOrderedQuantities } from '../reducers/cartSlice';
import { setGuestWishlist } from '../reducers/wishlistSlice';
import { useDispatch, useSelector } from 'react-redux';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import Success from './Success';
import { axiosAuth } from '../configurations/axiosConfig';

export default function Header() {
    const badgeRef = useRef();
    const wishRef = useRef();
    const count = useSelector(cartCount);
    const wishlistcount = useSelector(wishCount);
    const login = useSelector(isLoggedIn);
    const dispatch = useDispatch();
    const input = useSelector(searchInput);
    const navigate = useNavigate();

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const badge = badgeRef.current;
        if (badge) {
            // Cart count animation
            badge.classList.add('animate');
            const timer = setTimeout(() => {
                badge.classList.remove('animate');
            }, 300);

            // Escape key listener for search box
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    dispatch(clearSearch());
                }
            };
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [count, dispatch]);

    useEffect(() => {
        const wish = wishRef.current;
        if (wish) {
            // Wishlist animation
            wish.classList.add('animate');
            const timer = setTimeout(() => {
                wish.classList.remove('animate');
            }, 300);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [wishlistcount, dispatch]);

    function updateInput(e) {
        dispatch(setSearch(e.target.value));
    }

    function handleLogout() {
        setShowSuccess(true);
        dispatch(setLoggedOut());
        dispatch(setUser(null));
        dispatch(setCart([]));
        dispatch(setGuestWishlist([]));
        dispatch(updateCartCount(0));
        dispatch(updateWishCount(0));
        Cookies.remove("guestCart");
        Cookies.remove("guestWishlist");

        axiosAuth.post("/logout")
            .then(() => {
                dispatch(clearOrderedQuantities());
                dispatch(setLoggedOut());
                dispatch(closeCart());
                navigate("/");
            });
    }

    return (
        <header className='header'>
            <div className='top-menu'>
                <img className='img-logo bor-rad' src={storeLogo} alt='logo.jpeg' />
                <h3 className='groc-name wow animate__animated animate__rubberBand'>Grocery Store</h3>
                <div className='flex rel'>
                    <div className='rel'>
                        <i className="bi bi-search search-icon abs"></i>
                        <input className='search' name='search' value={input}
                            onChange={(e) => updateInput(e)} placeholder='Search for Products...' />
                    </div>
                    {login ? <button className='login' onClick={() => handleLogout()}>
                        <div className='logout'><div><i className="bi bi-person"></i></div>Logout</div>
                    </button>
                        : <button className='login' onClick={() => dispatch(displayLogin())}>Login / Sign Up</button>}
                    <i ref={wishRef} className="bi bi-bag-heart heart" onClick={() => { dispatch(displayWishList()) }}></i>
                    <img className='img-cart' src={shoppingCart} alt='cart.jpeg' />
                    <span ref={badgeRef} onClick={() => { dispatch(displayCart()) }} className='cart-count abs'>{count}</span>
                </div>
            </div>
            {showSuccess && (
                // {dispatch(showSuccess())}
                <Success
                    header="You have been logged out"
                    message="Thank you"
                    onConfirm={() => {
                        setShowSuccess(false);
                        navigate('/');
                    }}
                />
            )}
            <Login />
        </header>
    )
}