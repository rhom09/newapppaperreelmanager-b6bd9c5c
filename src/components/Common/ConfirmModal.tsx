import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay confirm-modal-overlay">
            <div className="modal-content confirm-modal card animate-scale-in">
                <div className="modal-header">
                    <div className={`title-with-icon ${variant}`}>
                        {variant === 'danger' && <AlertTriangle size={24} />}
                        <h2>{title}</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body confirm-modal-body">
                    <p>{message}</p>
                </div>

                <div className="modal-actions confirm-modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
