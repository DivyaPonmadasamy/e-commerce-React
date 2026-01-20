import '../styles/ProductCard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';   //wowjs
import WOW from 'wowjs';

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateCartCount, searchInput, updateWishCount } from '../reducers/headerSlice';
import { setLoggedIn, user, setUser } from '../reducers/loginSlice';
import {
    products, setProducts, cart, setCart, guestCart, addToGuestCart, updateAddMore,
    incrementGuestCart, decrementGuestCart, removeFromGuestCart
} from '../reducers/cartSlice';
import { guestWishlist, setGuestWishlist, addToGuestWishlist, removeFromGuestWishlist } from '../reducers/wishlistSlice';
import { calculatePrice } from '../utils/prodCardMethods';
import Cart from './Cart';
import AddMore from './AddMore';
import { useAuth } from '../utils/useAuth';
import { axiosAuth, axiosPublic } from '../configurations/axiosConfig';
import Cookies from 'js-cookie';
import WishList from './WishList';

export default function ProductCard() {

    const allProducts = useSelector(products);
    const [categories, setCategories] = useState([]);
    const cartItems = useSelector(cart);
    const localGuestcart = useSelector(guestCart);
    const [localCart, setLocalCart] = useState([]);
    const localGuestWishlist = useSelector(guestWishlist);
    const [localWishlist, setLocalWishlist] = useState([]);

    const input = useSelector(searchInput);
    const dispatch = useDispatch();
    const userloc = useSelector(user);

    const userauth = useAuth();

    useEffect(() => {
        if (userauth?.email && !userloc.id) {
            // Fetch full user details from backend using email
            axiosAuth.get(`/user/email/${userauth.email}`)
                .then(res => {
                    dispatch(setUser(res.data)); // sets userloc
                    dispatch(setLoggedIn());
                });
        }
    }, [userauth, userloc.id, dispatch]);

    // fetch products from product table and their category
    useEffect(() => {
        axiosPublic.get('products/getallproducts').then(response => {
            if (response.status === 200) dispatch(setProducts(response.data));
        })
        axiosPublic.get('/getallcategories').then(response => {
            if (response.status === 200) setCategories(response.data);
        })
    }, [dispatch]);

    // cookie for guest cart
    useEffect(() => {
        try {
            Cookies.set('guestCart', JSON.stringify(localGuestcart), { path: '/', expires: 1 });
        } catch (e) {
            console.error('Failed to set guestCart cookie', e);
        }
        if (!userloc?.id) {
            dispatch(updateCartCount(localGuestcart.length));
        }
    }, [localGuestcart, dispatch, userloc?.id]);

    // cookie for guest wishlist
    useEffect(() => {
        try {
            Cookies.set("guestWishlist", JSON.stringify(localGuestWishlist), { path: "/", expires: 1 });
        } catch (e) {
            console.error("Failed to set guestWish cookie", e);
        }
        if (!userloc?.id) {
            dispatch(updateWishCount(localGuestWishlist.length));
        }
    }, [localGuestWishlist, dispatch, userloc?.id]);


    // fetch cartCount from cart_item table
    const cartCount = useCallback(() => {
        axiosAuth.get(`/cart/count/${userloc.id}`)
            .then(res => dispatch(updateCartCount(res.data)));
    }, [userloc.id, dispatch]);

    // fetch cartItems from cart_item table
    useEffect(() => {
        if (userloc.id) {
            axiosAuth.get(`/cart/${userloc.id}`)
                .then(res => {
                    dispatch(setLoggedIn());
                    dispatch(setCart(res.data));
                    setLocalCart(res.data);
                    cartCount();
                });
        }
    }, [userloc.id, dispatch, cartCount]);

    // fetch items for wishlist from wish_list table
    useEffect(() => {
        if (userloc.id)
            axiosAuth.get(`/wishlist/get/${userloc.id}`)
                .then(res => {
                    setLocalWishlist(res.data);
                    dispatch(setGuestWishlist(res.data));
                    dispatch(updateWishCount(res.data.length));
                })
                .catch(err => console.error('reloadWishList failed', err));
    }, [userloc.id, dispatch]);

    // guest cart
    useEffect(() => {
        if (!userloc?.id) {
            setLocalCart(localGuestcart);
            dispatch(updateCartCount(localGuestcart.length));
        }
    }, [localGuestcart, userloc?.id, dispatch]);

    // guest wishlist
    useEffect(() => {
        if (!userloc?.id) {
            setLocalWishlist(localGuestWishlist);
            dispatch(updateWishCount(localGuestWishlist.length));
        }
    }, [localGuestWishlist, userloc?.id, dispatch]);

    useEffect(() => {
        // if user is logged in, use the server-backed cart from redux
        if (userloc?.id) {
            setLocalCart(Array.isArray(cartItems) ? cartItems : []);
            dispatch(updateCartCount(Array.isArray(cartItems) ? cartItems.length : 0));
            return;
        }
        setLocalCart(Array.isArray(localGuestcart) ? localGuestcart : []);
        dispatch(updateCartCount(Array.isArray(localGuestcart) ? localGuestcart.length : 0));
    }, [cartItems, localGuestcart, userloc?.id, dispatch]);

    useEffect(() => {
        const wow = new WOW.WOW({
            live: false // Set to true if you are dynamically adding content
        });
        wow.init();
    }, []);

    const filtered = input.trim()
        ? allProducts.filter(item =>
            item.name.toLowerCase().includes(input.toLowerCase())
        )
        : allProducts;

    // function for cart_items fetch whenever reload is required
    function reloadCart() {
        if (!userloc?.id) return;
        axiosAuth.get(`/cart/${userloc.id}`)
            .then(res => {
                setLocalCart(res.data);
                dispatch(setCart(res.data));
                cartCount();
            }).catch(err => console.error('reloadCart failed', err));
    }

    function addToCart(item) {
        if (item.orderedquantity <= 0) {
            toast.warn("Please select a quantity before adding!");
            return;
        }

        // guest cart
        if (!userloc?.id) {
            const existing = localCart.find(val => val.id === item.id);
            if (existing) {
                dispatch(updateAddMore({
                    show: true, name: item.name,
                    quantity: item.orderedquantity * item.quantity,
                    unit: item.unit, item
                }));
                return;
            }
            dispatch(addToGuestCart({
                id: item.id, quantity: item.orderedquantity, name: item.name,
                url: item.url, mrp: item.mrp, discount: item.discount
            }));
            toast.success("Item added to cart!");
            return;
        }

        // check if item already exists in DB cart_item - logged in cart
        const alreadyAddedIndex = localCart.findIndex(val => val.productid === item.id);
        if (alreadyAddedIndex !== -1) {
            dispatch(updateAddMore({
                show: true, name: item.name,
                quantity: (item.orderedquantity * item.quantity),
                unit: item.unit, item: item
            }));
            return;
        }

        const cartPayload = {
            userId: userloc.id,
            productId: item.id,
            quantity: item.orderedquantity
        };

        axiosAuth.post('/cart', cartPayload)
            .then(() => {
                toast.success("Item added to cart!");
                reloadCart();
            });
    }

    function addMoreToCart(item) {
        // guest cart
        if (!userloc?.id) {
            dispatch(addToGuestCart({
                id: item.id, quantity: item.orderedquantity, name: item.name,
                url: item.url, mrp: item.mrp, discount: item.discount
            }));

            toast.success("Cart updated!");
            dispatch(updateAddMore({ show: false }));
            return;
        }

        // logged-in cart
        const existing = localCart.find(val => val.productid === item.id);

        if (existing) {
            axiosAuth.put(`/cart/addmore/${existing.id}`, {
                quantity: item.orderedquantity
            }).then(() => {
                toast.success("Cart updated!");
                reloadCart();
                dispatch(updateAddMore({ show: false }));
            }).catch(err => console.error(err));
        } else {
            // first time — add to cart
            axiosAuth.post('/cart', {
                userId: userloc.id,
                productId: item.id,
                quantity: item.orderedquantity
            }).then(() => {
                toast.success("Item added to cart!");
                reloadCart();
                dispatch(updateAddMore({ show: false }));
            }).catch(err => console.error(err));
        }
    }

    function incQuantity(cartItemId, flag) {
        // logged-in cart
        if (userloc?.id && flag) {
            setLocalCart(prev => prev.map(item =>
                item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
            ));
            axiosAuth.put(`/cart/inc/${cartItemId}`)
                .catch(err => console.error('inc api failed', err));
            return;
        }

        // guest cart
        const updated = allProducts.map(item =>
            item.id === cartItemId ? { ...item, orderedquantity: item.orderedquantity + 1 } : item
        );
        dispatch(setProducts(updated));
        flag && dispatch(incrementGuestCart({ id: cartItemId }));
    }

    function decQuantity(cartItemId, flag) {
        // logged-in cart
        if (userloc?.id && flag) {
            setLocalCart(prev => prev.map(item =>
                item.id === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
            ));

            axiosAuth.put(`/cart/dec/${cartItemId}`)
                .catch(err => console.error('dec api failed', err));

            return;
        }

        // guest cart
        const updated = allProducts.map(item =>
            item.id === cartItemId ? { ...item, orderedquantity: Math.max(0, item.orderedquantity - 1) } : item
        );
        dispatch(setProducts(updated));
        const cartItem = localGuestcart.find(p => p.id === cartItemId);

        if (!cartItem) return;

        if ((cartItem?.quantity || 0) > 0 && flag) {
            dispatch(decrementGuestCart({ id: cartItemId }));
        }
    }

    function deleteProd(cartItemId) {
        // guest cart
        if (!userloc?.id) {
            dispatch(removeFromGuestCart(cartItemId));
            toast.info("Item removed from cart");
            return;
        }

        // logged-in cart
        const updated = localCart.filter(item => item.id !== cartItemId);
        setLocalCart(updated);
        dispatch(updateCartCount(updated.length));
        axiosAuth.delete(`/cart/del/${cartItemId}`)
            .then(() => {
                if (userloc?.id)
                    axiosAuth.get(`/cart/${userloc.id}`)
                        .then(res => {
                            dispatch(setCart(res.data));
                            toast.info("Item removed from cart");
                        })
                        .catch(err => console.error('fetch after delete failed', err));
            }).catch(err => console.error('delete api failed', err));
    }

    function reloadWishList() {
        if (userloc?.id) {
            axiosAuth.get(`/wishlist/get/${userloc.id}`)
                .then(res => {
                    setLocalWishlist(res.data);
                    dispatch(setGuestWishlist(res.data));
                    dispatch(updateWishCount(res.data.length));
                })
                .catch(err => console.error('reloadWishList failed', err));
        }
    }

    function addToWishList(item) {
        // guest wishlist
        if (!userloc?.id) {
            const existing = localGuestWishlist.find(val => val.id === item.id);

            if (existing) {
                toast.info("Already in wishlist!");
                return;
            }

            dispatch(addToGuestWishlist({
                id: item.id,
                name: item.name,
                url: item.url,
                mrp: item.mrp,
                discount: item.discount
            }));
            toast.success("Added to wishlist!");
            dispatch(updateWishCount(localGuestWishlist.length + 1));
            return;
        }

        // logged-in wishlist
        const existing = localWishlist.find(val => val.productid === item.id);

        if (existing) {
            toast.info("Already in wishlist!");
            return;
        }

        axiosAuth.post("/wishlist/add", {
            userid: userloc.id,
            productid: item.id
        }).then(() => {
            toast.success("Added to wishlist!");
            reloadWishList();
        }).catch(err => console.error(err));
    }

    function deleteFromWishlist(wishlistId) {
        // guest wishlist
        if (!userloc?.id) {
            toast.success("Removed from wishlist!");
            dispatch(removeFromGuestWishlist(wishlistId));
            dispatch(updateWishCount(localGuestWishlist.length - 1));
            return;
        }

        // logged-in wishlist
        const updated = localWishlist.filter(item => item.id !== wishlistId);
        toast.success("Removed from wishlist!");
        setLocalWishlist(updated);
        dispatch(updateWishCount(updated.length));
        axiosAuth.delete(`/wishlist/remove/${wishlistId}`)
            .then(() => reloadWishList())
            .catch(err => console.error('delete api failed', err));
    }

    function addToCartFromWishlist(item) {

        const wishlistItem = localWishlist.find(w =>
            userloc?.id ? w.productid === item.productid : w.id === item.id
        );

        if (!wishlistItem) return;

        // guest user
        if (!userloc?.id) {
            const itemInCart = localCart.find(c => c.id === item.id);

            if (itemInCart) {
                toast.info("Item already exists in cart");
                return;
            }

            // remove from guest wishlist
            dispatch(removeFromGuestWishlist(item.id));
            dispatch(updateWishCount(localGuestWishlist.length - 1));

            // add to guest cart
            dispatch(addToGuestCart({
                id: wishlistItem.id,
                name: wishlistItem.name,
                url: wishlistItem.url,
                mrp: wishlistItem.mrp,
                discount: wishlistItem.discount,
                quantity: 1
            }));

            toast.success("Item added to cart!");
            return;
        }

        // logged-in user
        const existing = localCart.find(c => c.productid === item.productid);
        if (existing) {
            toast.info("Item already exists in cart");
            return;
        }

        // remove from wish_list
        // axiosAuth.delete(`/wishlist/delete/${userloc.id}/${id}`)
        axiosAuth.delete(`/wishlist/remove/${item.id}`)
            .then(() => {
                reloadWishList();

                // add to cart_item
                axiosAuth.post('/cart', {
                    userId: userloc.id,
                    productId: item.productid,
                    quantity: 1
                })
                    .then(() => {
                        toast.success("Item added to cart!");
                        reloadWishList();
                        reloadCart();
                    })
                    .catch(err => console.error("Add to cart failed", err));
            })
            .catch(err => console.error("Wishlist delete failed", err));
    }

    return (
        <>
            <div className='top'></div>
            {filtered.length > 0
                ? (
                    categories.map(category => {
                        const itemsInCategory = filtered.filter(item => item.category === category.id);

                        if (itemsInCategory.length === 0) return null;

                        return (
                            <div key={category.id} className="category-block wow animate__animated animate__fadeInUp">
                                <h3 className='category-heading'>{category.name}</h3>
                                <div className='card wow animate__animated animate__fadeInUp'>
                                    {itemsInCategory.map(item => (
                                        <div className='section' key={item.id}>
                                            <div className='border rel'>
                                                <span className='offer abs'>{`${item.discount}% OFF`}</span>
                                                <img src={item.url} alt={item.name + '.jpeg'} />
                                                {(userloc?.id
                                                    ? localWishlist.some(w => w.productid === item.id)
                                                    : localGuestWishlist.some(w => w.id === item.id)
                                                ) ? (
                                                    <i
                                                        className="bi bi-heart-fill abs wish-heart"
                                                        onClick={() => {
                                                            if (userloc?.id) {
                                                                const wlItem = localWishlist.find(w => w.productid === item.id);
                                                                if (wlItem) deleteFromWishlist(wlItem.id);
                                                            } else {
                                                                deleteFromWishlist(item.id);
                                                            }
                                                        }}
                                                    ></i>
                                                ) : (
                                                    <i
                                                        className="bi bi-heart abs wish-heart"
                                                        onClick={() => addToWishList(item)}
                                                    ></i>
                                                )}
                                            </div>
                                            <div>
                                                <p className='p'>{item.name}</p>
                                                <div className="flex jcsb">
                                                    <div className='flex vac'>
                                                        <p className='fs-18 p b mar-r-3'>{`₹ ${calculatePrice(item.mrp, item.discount)}`}</p>
                                                        <p className='fs-12 lt clr-lp'>{`₹${item.mrp}`}</p>
                                                    </div>
                                                    <p className='p'>{`${item.quantity} ${item.unit}`}</p>
                                                </div>
                                                <div className='flex jcsb vac'>
                                                    <button className='btn' onClick={() => { decQuantity(item.id) }}>-</button>
                                                    <span className='p'>Rs.{item.orderedquantity * calculatePrice(item.mrp, item.discount)}</span>
                                                    <span className='p'>
                                                        {item.unit === 'g' && item.orderedquantity * item.quantity >= 1000
                                                            ? `${(item.orderedquantity * item.quantity) / 1000} kg`
                                                            : `${item.orderedquantity * item.quantity} ${item.unit}`}
                                                    </span>

                                                    <button className='btn' onClick={() => { incQuantity(item.id) }}>+</button>
                                                </div>
                                                <div className='flex jcc'>
                                                    <button className='btn add-btn' onClick={() => { addToCart(item) }}><span>Add</span></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }))
                : (
                    <div className='sorry'>
                        <p><i className="bi bi-emoji-frown-fill" style={{ fontSize: '30px' }}></i>
                            &nbsp;&nbsp;Sorry, no matching products found...</p>
                    </div>
                )}
            <Cart product={localCart} inc={(id) => incQuantity(id, true)} dec={(id) => decQuantity(id, true)} del={(id) => deleteProd(id)} />
            <WishList wishlist={localWishlist} addToCart={(item) => addToCartFromWishlist(item)} remove={(id) => deleteFromWishlist(id)} />
            <AddMore add={(item) => addMoreToCart(item)} />
        </>
    );
}