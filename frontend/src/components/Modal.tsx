import type { ReactNode } from "react";
import "../styles/Modal.css";

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  icon?: ReactNode;
  buttonText?: string;
  onClose: () => void;
}

const InfoModal = ({
  isOpen,
  title,
  message,
  icon,
  buttonText = "Got it",
  onClose,
}: InfoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div
        className="info-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="info-modal-close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {icon && <div className="info-modal-icon">{icon}</div>}

        <div className="info-modal-content">
          <h2 id="info-modal-title">{title}</h2>

          <p>{message}</p>
        </div>

        <button
          type="button"
          className="info-modal-button"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InfoModal;