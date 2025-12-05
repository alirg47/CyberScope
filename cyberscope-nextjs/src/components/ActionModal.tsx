'use client';

import { useState } from 'react';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (comment: string) => void;
    title: string;
    actionLabel?: string;
}

const ActionModal = ({ isOpen, onClose, onSubmit, title, actionLabel = 'Confirm' }: ActionModalProps) => {
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(comment);
        setComment('');
        onClose();
    };

    const handleCancel = () => {
        setComment('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={handleCancel}>✕</button>
                </div>

                <div className="modal-body">
                    <label htmlFor="comment">Comments (Optional):</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add comments or additional details..."
                        rows={5}
                        className="modal-textarea"
                    />
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
