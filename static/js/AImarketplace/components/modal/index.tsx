import { useEffect, useState } from 'react';
import './index.scss';

const Modal = ({ isOpen, onClose, title, children }) => {
    const [modalstyle, setModalStyle] = useState(true);

    useEffect(() => {
        if (!title) return;
        title == "Subscribe this Oracle" ? setModalStyle(true) : setModalStyle(false);
    }, [title])

    if (!isOpen) return null;
    return (
        <div className="oracle-modal" onClick={onClose} >
            <div className="modal-content" data-selected={modalstyle} onClick={(e => e.stopPropagation())} >
                <span className="close" onClick={onClose}>&times;</span>
                <h1 style={{ color: 'black' }}>{title}</h1>
                {children}
            </div>
        </div>
    );
};

export default Modal;