import { useDispatch, useSelector } from "react-redux"
import { addMore, updateAddMore } from '../reducers/cartSlice';
import { useEffect, useRef } from "react";

export default function AddMore(props) {

    const addmore = useSelector(addMore);
    const addMoreRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') dispatch(updateAddMore({ show: false }));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch]);

    function handleExit(e) {
        if (addMoreRef.current && !addMoreRef.current.contains(e.target))
            dispatch(updateAddMore({ show: false }));
    }

    if (addmore.show) {
        return (
            <div className="popup" onClick={(e) => handleExit(e)}>
                <div className="add-more rel" ref={addMoreRef}>
                    <span className='cross-btn abs' onClick={() => { dispatch(updateAddMore({ show: false })) }}><i className="bi bi-x"></i></span>
                    <p className="tab tac mar-5">You already have {addmore.name} in your cart.</p>
                    <p className="tab tac mar-5">Do you want to add {addmore.quantity >= 1000 && addmore.unit === 'g'
                        ? `${addmore.quantity / 1000} kg`
                        : `${addmore.quantity} ${addmore.unit}`}
                        &nbsp;more of {addmore.name}?</p>
                    <div className="flex jcsa mar-t-40">
                        <button className="btn add-mr-btn" onClick={() => props.add(addmore.item)}>YES</button>
                        <button className="btn add-mr-btn" onClick={() => { dispatch(updateAddMore({ show: false })) }}>NO</button>
                    </div>
                </div>
            </div>
        )
    }
    return null;
}