import { useEffect, useRef, useState } from "react";
import styles from "../../styles/BookingCta.module.css";

interface BookingCTAProps {
  onBookClick?: () => void;
}

export default function BookingCTA({ onBookClick }: BookingCTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      aria-label="Book an appointment"
    >
      <div className={styles.card}>
        <div className={styles.text}>
          <span className={styles.eyebrow}>Ready To Book?</span>
          <h2 className={styles.heading}>
            Your next great look starts with one appointment.
          </h2>
          <p className={styles.subtext}>
            Walk out sharper, sit back with confidence, and let the craft speak
            for itself.
          </p>
        </div>

        <button type="button" className={styles.cta} onClick={onBookClick}>
          Book Appointment
        </button>
      </div>
    </section>
  );
}
