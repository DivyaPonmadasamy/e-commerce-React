import '../styles/WishList.css';
import { closeWishList, showWishList, wishCount } from '../reducers/headerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { calculatePrice, calculateSaving } from '../utils/prodCardMethods'

export default function WishList(props) {
    const dispatch = useDispatch();
    const wishlist = useSelector(showWishList);
    const wishlistRef = useRef();
    const counter = useSelector(wishCount);

    useEffect(() => {
        if (!wishlist) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') dispatch(closeWishList());
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [wishlist, dispatch]);

    function handleExit(e) {
        if (wishlistRef.current && !wishlistRef.current.contains(e.target))
            dispatch(closeWishList());
    }

    if (wishlist && counter !== 0) {
        return (
            <div className="popup" onClick={(e) => handleExit(e)}>
                <div className="wishlist rel" ref={wishlistRef}>
                    <span className='cross-btn abs' onClick={() => { dispatch(closeWishList()) }}><i className="bi bi-x"></i></span>
                    <p className='wishlist-header'>My Wishlist</p>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr className='tab tab-hdr'>
                                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PRODUCTS</th>
                                    <th className='tac'>PRICE</th>
                                    <th className='tac'>SAVINGS</th>
                                    <th className='tac'>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    props.wishlist.map((item) => {
                                        return (
                                            <tr key={item.id} className='tab tab-body'>
                                                <td className='thumb-cell'>
                                                    <img src={item.url} alt={item.name + '.jpeg'} className='thumbnail' />
                                                    <div>
                                                        <p>{item.name}</p>
                                                        <p onClick={() => { props.remove(item.id) }}>Remove</p>
                                                    </div>
                                                </td>
                                                <td className='tac b-600'>₹ {calculatePrice(item.mrp, item.discount)}</td>
                                                <td className='tac save-price'>₹ {calculateSaving(item.mrp, item.discount)}</td>
                                                <td className='tac'>
                                                    <button className="add-btn" onClick={() => { props.addToCart(item) }}>Add to Cart</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } else if (wishlist)
        return (
            <div className="popup" onClick={(e) => handleExit(e)}>
                <span className="wishlist empty-wishlist rel" ref={wishlistRef}>
                    <div>
                        <i className="bi bi-heartbreak-fill" style={{ fontSize: '30px' }}></i>
                    </div>
                    <span className='cross-btn abs' onClick={() => { dispatch(closeWishList()) }}><i className="bi bi-x"></i></span>
                    &nbsp;  Your wishlist is empty!
                </span>
            </div>
        );
}