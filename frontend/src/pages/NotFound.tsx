import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.css";

export default function NotFound() {
  return (
    <section className={styles.section}>
      <span className={styles.code}>404</span>
      <h1 className={styles.heading}>This chair's empty.</h1>
      <p className={styles.text}>
        The page you're looking for doesn't exist, may have moved, or the
        link might be broken.
      </p>
      <Link to="/" className={styles.button}>
        Back to Home
      </Link>
    </section>
  );
}