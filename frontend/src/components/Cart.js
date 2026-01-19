import '../styles/Cart.css';
import { cartCount, showCart, closeCart } from '../reducers/headerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { calculatePrice, calculateSavings, calculateTotal } from '../utils/prodCardMethods';

export default function Cart(props) {

    const cart = useSelector(showCart);
    const counter = useSelector(cartCount);
    const dispatch = useDispatch();
    const cartRef = useRef();

    useEffect(() => {
        if (!cart) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') dispatch(closeCart());
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart, dispatch]);

    function handleExit(e) {
        if (cartRef.current && !cartRef.current.contains(e.target))
            dispatch(closeCart());
    }

    if (cart && counter !== 0) {
        return (
            <div className="popup" onClick={(e) => handleExit(e)}>
                <div className="cart rel" ref={cartRef}>
                    <span className='cross-btn abs' onClick={() => { dispatch(closeCart()) }}><i className="bi bi-x"></i></span>
                    <p className='cart-header'>Shopping Cart</p>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr className='tab tab-hdr'>
                                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PRODUCTS</th>
                                    <th className='tac'>QUANTITY</th>
                                    <th className='tac'>PRICE</th>
                                    <th className='tac'>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    props.product.map((item) => {
                                        return (
                                            <tr key={item.id} className='tab tab-body'>
                                                <td className='thumb-cell'>
                                                    <img src={item.url} alt={item.name + '.jpeg'} className='thumbnail' />
                                                    <div>
                                                        <p>{item.name}</p>
                                                        <p onClick={() => { props.del(item.id) }}>Remove</p>
                                                    </div>
                                                </td>
                                                <td className='tac'>
                                                    <div className='quantity'>
                                                        {item.quantity === 1
                                                            ? <i className="bi bi-trash" onClick={() => { props.del(item.id) }}></i>
                                                            : <i className="bi bi-dash-lg" onClick={() => { props.dec(item.id) }}></i>}
                                                        <p>{item.quantity}</p>
                                                        <i className="bi bi-plus-lg" onClick={() => { props.inc(item.id) }}></i>
                                                    </div>
                                                </td>
                                                <td className='tac'>{`₹ ${calculatePrice(item.mrp, item.discount)}`}</td>
                                                <td className='tac b-600'>₹ {`${calculatePrice(item.mrp, item.discount)}` * item.quantity}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="total-bar">
                        <p className='zoom-effect'>Saved: &nbsp;<span className='b'>{calculateSavings(props.product).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></p>
                        <p>Subtotal ({props.product.length} items): &nbsp;<span className='b'>₹ {calculateTotal(props.product).toLocaleString('en-IN')}</span></p>
                    </div>
                </div>
            </div>
        )
    } else if (cart)
        return <div className="popup" onClick={(e) => handleExit(e)}>
            <span className="cart empty-cart rel" ref={cartRef}>
                <div>
                    <i className="bi bi-cart3" style={{ fontSize: '30px' }}></i>
                </div>
                <span className='cross-btn abs' onClick={() => { dispatch(closeCart()) }}><i className="bi bi-x"></i></span>
                &nbsp;  Your cart is empty!
            </span>
        </div>
}