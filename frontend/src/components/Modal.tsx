import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "../styles/Modal.module.css";

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  icon?: ReactNode;
  buttonText?: string;
  onClose: () => void;
}

export default function InfoModal({
  isOpen,
  title,
  message,
  icon,
  buttonText = "Got it",
  onClose,
}: InfoModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Mount / unmount with a short exit transition instead of popping instantly.
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setShouldRender(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = setTimeout(() => {
      setShouldRender(false);
      previouslyFocused.current?.focus?.();
    }, 220);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Lock page scroll while the modal is up — pin body position rather than
  // just hiding overflow, since overflow:hidden alone lets mobile browsers'
  // address bar collapse/expand and briefly reveal the raw body background.
  useEffect(() => {
    if (!shouldRender) return;

    const scrollY = window.scrollY;
    const { style } = document.body;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.overflow = "hidden";

    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [shouldRender]);

  // Focus the action button on open, close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    buttonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.visible : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`${styles.dialog} ${visible ? styles.visible : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
        aria-describedby="info-modal-message"
      >
        {icon && (
          <div className={styles.iconBadge} aria-hidden="true">
            {icon}
          </div>
        )}

        <h2 id="info-modal-title" className={styles.title}>
          {title}
        </h2>

        <p id="info-modal-message" className={styles.message}>
          {message}
        </p>

        <button
          ref={buttonRef}
          type="button"
          className={styles.button}
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
