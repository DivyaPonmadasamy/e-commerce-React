import '../styles/Success.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';

export default function Success(props) {
    const successRef = useRef();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') props.onConfirm();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [props]);

    function handleExit(e) {
        if (successRef.current && !successRef.current.contains(e.target))
            props.onConfirm();
    }

    return (
        <div className="popup" onClick={(e) => handleExit(e)}>
            <div className="modal" ref={successRef}>
                <FontAwesomeIcon icon={faCheck} className='tick' />
                <h2>{props.header}</h2>
                <p>{props.message}</p>
                <button onClick={props.onConfirm}>OK</button>
            </div>
        </div>
    );
}