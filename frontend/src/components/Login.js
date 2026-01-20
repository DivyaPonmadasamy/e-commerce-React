import '../styles/Login.css'
import { useDispatch, useSelector } from "react-redux";
import { showLogin, closeLogin, updateCartCount, updateWishCount } from "../reducers/headerSlice";
import { setLoggedIn, setUser } from "../reducers/loginSlice";
import { setCart, guestCart, clearGuestCart } from "../reducers/cartSlice";
import { setWishlist, guestWishlist, clearGuestWishlist } from '../reducers/wishlistSlice';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { axiosAuth } from '../configurations/axiosConfig';
import Cookies from 'js-cookie';

export default function Login() {
    const [cookies, setCookies] = useCookies(['rememberUser']);

    const login = useSelector(showLogin);
    const localGuestcart = useSelector(guestCart);
    const localGuestWishlist = useSelector(guestWishlist);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginRef = useRef();

    const [username, setUsername] = useState(() => (cookies.rememberUser) ? cookies.rememberUser : '');
    const [password, setPassword] = useState(() => (cookies.rememberPass) ? cookies.rememberPass : '');
    const [isChecked, setIsChecked] = useState(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const [emailError, setEmailError] = useState('');
    const [pswdError, setPswdError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (!login) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                dispatch(closeLogin());
                navigate("/");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [login, navigate, dispatch]);

    useEffect(() => {
        if (isChecked) {
            setCookies('rememberUser', username, { path: '/', maxAge: 86400 });
            setCookies('rememberPass', password, { path: '/', maxAge: 86400 });
        }
    }, [isChecked, setCookies, username, password]);

    function handleExit(e) {
        if (loginRef.current && !loginRef.current.contains(e.target)) {
            dispatch(closeLogin());
            navigate("/");
        }
    }

    function handleLoginSuccess(userid) {
        axiosAuth.get(`/cart/${userid}`)
            .then(res => {
                const finalCart = Array.isArray(res.data) ? res.data : [];
                dispatch(setCart(finalCart));
            })
            .catch(err => console.error("loadCartAfterLogin failed", err));
    }

    function emailValidation() {
        if (!emailRegex.test(username)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    }

    function pswdValidation() {
        if (!passwordRegex.test(password)) {
            setPswdError('Invalid Password');
            return false;
        }
        setPswdError('');
        return true;
    }

    function validateUser(e) {
        const isEmailValid = emailValidation();
        const isPswdValid = pswdValidation();

        if (!isEmailValid || !isPswdValid) return;

        const loginPayload = {
            email: username.toLowerCase(),
            password: password,
        };

        async function mergeGuestCart(userid) {
            try {
                if (!localGuestcart || localGuestcart.length === 0) return;

                const dbRes = await axiosAuth.get(`/cart/${userid}`);
                const dbCart = Array.isArray(dbRes.data) ? dbRes.data : [];

                const dbMap = new Map();
                dbCart.forEach(ci => {
                    dbMap.set(ci.productid, ci.quantity || 0);
                });

                const payload = [];
                for (const g of localGuestcart) {
                    const guestQty = g.quantity || 0;
                    const dbQty = dbMap.get(g.id) || 0;

                    if (guestQty > dbQty) {
                        payload.push({
                            productId: g.id,
                            quantity: guestQty - dbQty
                        });
                    }
                }

                if (payload.length === 0) {
                    handleLoginSuccess(userid);
                    dispatch(clearGuestCart());
                    Cookies.remove('guestCart');
                    return;
                }
                await axiosAuth.post(`/cart/merge/${userid}`, payload);

                const finalRes = await axiosAuth.get(`/cart/${userid}`);
                const finalCart = Array.isArray(finalRes.data) ? finalRes.data : [];
                dispatch(setCart(finalCart));
                dispatch(clearGuestCart());
                Cookies.remove('guestCart');
                dispatch(updateCartCount(finalCart.length));
            } catch (err) {
                console.error('mergeGuestCartPreferGuest failed', err);
            }
        }

        async function reloadWishlist(userid) {
            try {
                const res = await axiosAuth.get(`/wishlist/get/${userid}`);
                const list = Array.isArray(res.data) ? res.data : [];
                dispatch(setWishlist(list));
                dispatch(updateWishCount(list.length));

            } catch (err) {
                console.error("reloadWishlist failed", err);
            }
        }

        async function mergeGuestWishlist(userid) {
            try {
                if (!localGuestWishlist || localGuestWishlist.length === 0) {
                    await reloadWishlist(userid);
                    return;
                }
                const payload = localGuestWishlist.map(item => item.id);
                await axiosAuth.post(`/wishlist/merge/${userid}`, payload);
                await reloadWishlist(userid);
                dispatch(clearGuestWishlist());
                Cookies.remove("guestWishlist");

            } catch (err) {
                console.error("mergeGuestWishlist failed", err);
            }
        }

        axiosAuth
            .post('/login', loginPayload)
            .then((response) => {
                if (response.status === 200) {
                    const user = response.data;
                    if (!user || !user.id || isNaN(user.id)) {
                        console.error('Invalid user ID:', user?.id);
                        setLoginError('User is not registered');
                        return;
                    }

                    const token = user.token || response.data.token || response.headers['authorization'];
                    if (token) {
                        localStorage.setItem('authToken', token);
                        axiosAuth.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }

                    dispatch(setUser({ id: user.id, email: user.email }));
                    dispatch(setLoggedIn());
                    dispatch(closeLogin());
                    Promise.all([
                        mergeGuestCart(user.id),
                        mergeGuestWishlist(user.id)
                    ]).finally(() => {
                        handleLoginSuccess(user.id);
                        navigate('/');
                    });
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) setLoginError('Incorrect password');
                    else if (error.response.status === 404) setLoginError('User not found');
                    else setLoginError('Login failed. Please try again.');
                } else setLoginError('Server not reachable');
            });
    }

    function handleSubmit(e) {
        e.preventDefault();
        validateUser(e);
    }

    if (login) {
        return (
            <div className="popup" onClick={(e) => handleExit(e)}>
                <div className="login-page wow animate__animated animate__pulse" ref={loginRef}>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        {/* <form> */}
                        <h1>Login</h1>
                        <div className="inputbox">
                            <ion-icon name="mail-outline"></ion-icon>
                            <input type="email" required value={username}
                                onChange={(e) => setUsername(e.target.value)} onBlur={() => emailValidation()}
                                className={` ${username ? 'has-content' : ''}`} />
                            <label htmlFor="">Email</label>
                            {emailError && <span className="error-text">{emailError}</span>}
                        </div>
                        <div className="inputbox">
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            <input type={showPassword ? 'text' : 'password'} required value={password}
                                onChange={(e) => setPassword(e.target.value)} onBlur={() => pswdValidation()}
                                className={` ${password ? 'has-content' : ''}`} />
                            <label htmlFor="">Password</label>
                            <span className="toggle-password" onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? 'hide' : 'show'}
                            </span>
                            {pswdError && <span className="error-text">{pswdError}</span>}
                        </div>
                        <div>
                            <label htmlFor=""><input type="checkbox" checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)} />Remember Me</label>
                        </div>
                        <button type='submit' className='log-btn' onClick={(e) => validateUser(e)}>Sign in</button>
                        {loginError && <span className="error-text">{loginError}</span>}
                        <div className="register">
                            <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}