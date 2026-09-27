import styles from "../../styles/Loader.module.css";

interface ButtonLoaderProps {
  /** Diameter in px. Defaults to a size that sits nicely next to button text. */
  size?: number;
  className?: string;
  /** For screen readers, since the spinner alone conveys no text. */
  label?: string;
}

export default function Loader({
  size = 16,
  className = "",
  label = "Loading",
}: ButtonLoaderProps) {
  return (
    <svg
      className={`${styles.spinner} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42 100"
      />
    </svg>
  );
}
